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
import { Resume } from './entities/resume.entity';
import { Candidate } from '../candidates/entities/candidate.entity';
import { CLOUDINARY } from '../common/cloudinary/cloudinary.provider';

const CLOUDINARY_FOLDER = 'smart-recruitment-analytics/resumes';

@Injectable()
export class ResumesService {
  private readonly logger = new Logger(ResumesService.name);

  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
    // Existing Candidate repository is reused only to check existence -
    // the candidates module itself is not modified by this feature.
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @Inject(CLOUDINARY)
    private readonly cloudinary: typeof CloudinarySdk,
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

    const existing = await this.resumeRepository.findOneBy({ candidateId });

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

        // Remove the old asset only after the new metadata is safely
        // persisted. A failure here is logged, not thrown, so the
        // candidate ends up with a working new resume even if cleanup
        // of the stale Cloudinary asset needs manual follow-up.
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
        originalFilename: file.originalname,
        cloudinaryPublicId: uploadResult.public_id,
        mimeType: file.mimetype,
        fileSize: file.size,
        cloudinaryUrl: uploadResult.secure_url,
      });
      return await this.resumeRepository.save(resume);
    } catch (err) {
      // DB write failed after a successful Cloudinary upload of a NEW
      // asset - remove it so Cloudinary doesn't accumulate orphaned files.
      await this.deleteFromCloudinary(uploadResult.public_id).catch((cleanupErr) =>
        this.logger.error(
          `Orphaned Cloudinary asset '${uploadResult.public_id}' could not be cleaned up: ${cleanupErr.message}`,
        ),
      );
      throw err;
    }
  }

  async findOne(candidateId: string): Promise<Resume> {
    await this.assertCandidateExists(candidateId);
    const resume = await this.resumeRepository.findOneBy({ candidateId });
    if (!resume) {
      throw new NotFoundException(
        `No resume found for candidate '${candidateId}'.`,
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
    // Never trust the original filename for storage - generate a safe,
    // unique public_id instead.
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const publicId = `${candidateId}_${uniqueSuffix}`;

    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_FOLDER,
          public_id: publicId,
          // PDFs/DOCX are documents, not images - "raw" is the correct
          // Cloudinary resource type for non-image/video files.
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
        `Failed to delete resume from Cloudinary: ${(error as Error).message}`,
      );
    }
  }
}
