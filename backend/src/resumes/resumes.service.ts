import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Readable } from 'stream';
import { UploadApiResponse, v2 as CloudinarySdk } from 'cloudinary';

import { AiService } from '../ai/ai.service';
import { ResumeAnalysis } from '../applications/entities/resume-analysis.entity';
import { Job } from '../jobs/entities/job.entity';

import { Resume } from './entities/resume.entity';
import { Candidate } from '../candidates/entities/candidate.entity';
import { Application } from '../applications/entities/application.entity';
import { CLOUDINARY } from '../common/cloudinary/cloudinary.provider';

const CLOUDINARY_FOLDER = 'smart-recruitment-analytics/resumes';

@Injectable()
export class ResumesService {
  private readonly logger = new Logger(ResumesService.name);

constructor(
  @InjectRepository(Resume)
  private readonly resumeRepository: Repository<Resume>,
  @InjectRepository(Candidate)
  private readonly candidateRepository: Repository<Candidate>,
  @InjectRepository(Job)
private readonly jobRepository: Repository<Job>,
  @InjectRepository(Application)
  private readonly applicationRepository: Repository<Application>,
  @InjectRepository(ResumeAnalysis)
  private readonly resumeAnalysisRepository: Repository<ResumeAnalysis>,
  @Inject(CLOUDINARY)
  private readonly cloudinary: typeof CloudinarySdk,
  private readonly aiService: AiService,
) {}

  private async assertCandidateExists(candidateId: string): Promise<void> {
    const candidate = await this.candidateRepository.findOneBy({
      candidateId,
    });

    if (!candidate) {
      throw new NotFoundException(
        `Candidate with id '${candidateId}' not found.`,
      );
    }
  }

  /**
   * Legacy candidate-level resume upload.
   *
   * Kept for backward compatibility.
   * New applications should use uploadForApplication().
   */
  async upload(
    candidateId: string,
    file: Express.Multer.File,
  ): Promise<Resume> {
    await this.assertCandidateExists(candidateId);

    if (!file) {
      throw new BadRequestException(
        'No file was provided. Attach the resume under the "file" form field.',
      );
    }

    const existing = await this.resumeRepository.findOne({
      where: { candidateId },
      order: { updatedAt: 'DESC' },
    });

    const uploadResult = await this.uploadToCloudinary(file, candidateId);

    try {
      if (existing) {
        const oldPublicId = existing.cloudinaryPublicId;

        existing.originalFilename = file.originalname;
        existing.cloudinaryPublicId = uploadResult.public_id;
        existing.mimeType = file.mimetype;
        existing.fileSize = file.size;
        existing.cloudinaryUrl = uploadResult.secure_url;

        const saved = await this.resumeRepository.save(existing);

        if (oldPublicId !== uploadResult.public_id) {
          this.deleteFromCloudinary(oldPublicId).catch((err) =>
            this.logger.warn(
              `Failed to remove old Cloudinary asset '${oldPublicId}' after replacement: ${err.message}`,
            ),
          );
        }

        return saved;
      }

      const resume = this.resumeRepository.create({
        candidateId,
        applicationId: null,
        originalFilename: file.originalname,
        cloudinaryPublicId: uploadResult.public_id,
        mimeType: file.mimetype,
        fileSize: file.size,
        cloudinaryUrl: uploadResult.secure_url,
      });

      return await this.resumeRepository.save(resume);
    } catch (err) {
      await this.deleteFromCloudinary(uploadResult.public_id).catch(
        (cleanupErr) =>
          this.logger.error(
            `Orphaned Cloudinary asset '${uploadResult.public_id}' could not be cleaned up: ${cleanupErr.message}`,
          ),
      );

      throw err;
    }
  }

  /**
   * New application-specific resume upload.
   *
   * A candidate can have different resumes for different applications.
   */
  async uploadForApplication(
    applicationId: string,
    candidateId: string,
    file: Express.Multer.File,
  ): Promise<Resume> {
    await this.assertCandidateExists(candidateId);

    if (!file) {
      throw new BadRequestException(
        'No file was provided. Attach the resume under the "file" form field.',
      );
    }

    const application = await this.applicationRepository.findOneBy({
      applicationId,
    });

    if (!application) {
      throw new NotFoundException(
        `Application with id '${applicationId}' not found.`,
      );
    }
   

    // Security check: candidate can only upload a resume
    // for their own application.
   if (application.candidateId !== candidateId) {
  throw new BadRequestException(
    'You can only upload a resume for your own application.',
  );
}

const job = await this.jobRepository.findOne({
  where: { jobId: application.jobId },
});

if (!job) {
  throw new NotFoundException(
    `Job with id '${application.jobId}' not found.`,
  );
}

const parsedResume = await this.aiService.parseResume(file);

const ranking = await this.aiService.rankResume(file, {
  job_title: job.jobTitle,
  required_skills: job.requiredSkills ?? [],
  required_experience_years: job.requiredExperienceYears ?? 0,
  required_education: job.requiredEducation ?? [],
  required_certifications: job.requiredCertifications ?? [],
  preferred_projects_keywords: job.preferredProjectsKeywords ?? [],
});

    // One resume per application.
    const existing = await this.resumeRepository.findOneBy({
      applicationId,
    });

    const uploadResult = await this.uploadToCloudinary(file, candidateId);

    try {
      let resume: Resume;

      if (existing) {
        const oldPublicId = existing.cloudinaryPublicId;

        existing.originalFilename = file.originalname;
        existing.cloudinaryPublicId = uploadResult.public_id;
        existing.mimeType = file.mimetype;
        existing.fileSize = file.size;
        existing.cloudinaryUrl = uploadResult.secure_url;

        resume = await this.resumeRepository.save(existing);

        if (oldPublicId !== uploadResult.public_id) {
          this.deleteFromCloudinary(oldPublicId).catch((err) =>
            this.logger.warn(
              `Failed to remove old Cloudinary asset '${oldPublicId}' after replacement: ${err.message}`,
            ),
          );
        }
      } else {
        resume = this.resumeRepository.create({
          candidateId,
          applicationId,
          originalFilename: file.originalname,
          cloudinaryPublicId: uploadResult.public_id,
          mimeType: file.mimetype,
          fileSize: file.size,
          cloudinaryUrl: uploadResult.secure_url,
        });

        resume = await this.resumeRepository.save(resume);
      }

      // Keep the application table synchronized with the uploaded resume.
      application.resumeFilename = file.originalname;
application.resumeUrl = uploadResult.secure_url;
application.resumePublicId = uploadResult.public_id;
application.matchScore = String(ranking.overall_score);

await this.applicationRepository.save(application);

      const existingAnalysis = await this.resumeAnalysisRepository.findOne({
  where: { applicationId },
});

await this.resumeAnalysisRepository.save({
  ...(existingAnalysis ?? {}),
  applicationId,
  atsScore: String(ranking.overall_score),
  skills: JSON.stringify(parsedResume.skills ?? []),
  education: JSON.stringify(parsedResume.education ?? []),
  experience: null,
  projects: JSON.stringify(parsedResume.projects ?? []),
  certifications: null,
  parsedData: {
    ...parsedResume,
    ranking: {
      overallScore: ranking.overall_score,
      breakdown: ranking.breakdown,
    },
  },
});

      return resume;
    } catch (err) {
      await this.deleteFromCloudinary(uploadResult.public_id).catch(
        (cleanupErr) =>
          this.logger.error(
            `Orphaned Cloudinary asset '${uploadResult.public_id}' could not be cleaned up: ${cleanupErr.message}`,
          ),
      );

      throw err;
    }
  }

  async findOne(candidateId: string): Promise<Resume> {
    await this.assertCandidateExists(candidateId);

    const resume = await this.resumeRepository.findOne({
      where: { candidateId },
      order: { updatedAt: 'DESC' },
    });

    if (!resume) {
      throw new NotFoundException(
        `No resume found for candidate '${candidateId}'.`,
      );
    }

    return resume;
  }

  /**
   * Get the resume belonging to a specific application.
   */
  async findByApplication(
    applicationId: string,
    candidateId?: string,
  ): Promise<Resume> {
    const application = await this.applicationRepository.findOneBy({
      applicationId,
    });

    if (!application) {
      throw new NotFoundException(
        `Application with id '${applicationId}' not found.`,
      );
    }

    if (candidateId && application.candidateId !== candidateId) {
      throw new BadRequestException(
        'You can only access your own application resume.',
      );
    }

    const resume = await this.resumeRepository.findOneBy({
      applicationId,
    });

    if (!resume) {
      throw new NotFoundException(
        `No resume found for application '${applicationId}'.`,
      );
    }

    return resume;
  }

  async remove(candidateId: string): Promise<void> {
    const resume = await this.findOne(candidateId);

    await this.deleteFromCloudinary(resume.cloudinaryPublicId);
    await this.resumeRepository.remove(resume);
  }

  private uploadToCloudinary(
    file: Express.Multer.File,
    candidateId: string,
  ): Promise<UploadApiResponse> {
    // Never trust the original filename for storage.
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}`;

    const publicId = `${candidateId}_${uniqueSuffix}`;

    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_FOLDER,
          public_id: publicId,
          resource_type: 'raw',
          use_filename: false,
          unique_filename: false,
          overwrite: false,
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              new InternalServerErrorException(
                `Failed to upload resume to Cloudinary: ${
                  error?.message ?? 'unknown error'
                }`,
              ),
            );
          }

          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  private async deleteFromCloudinary(publicId: string): Promise<void> {
    try {
      await this.cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw',
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete resume from Cloudinary: ${
          (error as Error).message
        }`,
      );
    }
  }
}