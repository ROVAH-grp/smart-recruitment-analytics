import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { Resume } from './entities/resume.entity';
import { Candidate } from '../candidates/entities/candidate.entity';
import { CLOUDINARY } from '../common/cloudinary/cloudinary.provider';

describe('ResumesService', () => {
  let service: ResumesService;

  const mockResumeRepo = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockCandidateRepo = {
    findOneBy: jest.fn(),
  };

  const mockCloudinary = {
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResumesService,
        { provide: getRepositoryToken(Resume), useValue: mockResumeRepo },
        {
          provide: getRepositoryToken(Candidate),
          useValue: mockCandidateRepo,
        },
        { provide: CLOUDINARY, useValue: mockCloudinary },
      ],
    }).compile();

    service = module.get<ResumesService>(ResumesService);
  });

  const fakeFile = (): Express.Multer.File =>
    ({
      originalname: 'resume.pdf',
      mimetype: 'application/pdf',
      size: 12345,
      buffer: Buffer.from('fake pdf content'),
    }) as Express.Multer.File;

  const mockSuccessfulUploadStream = (publicId: string) => {
    mockCloudinary.uploader.upload_stream.mockImplementation(
      (_opts: any, callback: any) => {
        callback(null, {
          public_id: publicId,
          secure_url: `https://res.cloudinary.com/demo/raw/upload/${publicId}`,
        });
        return { end: jest.fn() } as any;
      },
    );
  };

  describe('upload', () => {
    it('throws NotFoundException when the candidate does not exist', async () => {
      mockCandidateRepo.findOneBy.mockResolvedValue(null);

      await expect(service.upload('C9999', fakeFile())).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws BadRequestException when no file is provided', async () => {
      mockCandidateRepo.findOneBy.mockResolvedValue({ candidateId: 'C0001' });

      await expect(
        service.upload('C0001', undefined as unknown as Express.Multer.File),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates a new resume record when the candidate has none yet', async () => {
      mockCandidateRepo.findOneBy.mockResolvedValue({ candidateId: 'C0001' });
      mockResumeRepo.findOneBy.mockResolvedValue(null);
      mockSuccessfulUploadStream('smart-recruitment-analytics/resumes/C0001_1');
      mockResumeRepo.create.mockImplementation((dto) => dto);
      mockResumeRepo.save.mockImplementation((entity) =>
        Promise.resolve({ resumeId: '1', ...entity }),
      );

      const result = await service.upload('C0001', fakeFile());

      expect(mockResumeRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ candidateId: 'C0001' }),
      );
      expect(result.candidateId).toBe('C0001');
    });

    it('replaces an existing resume and removes the old Cloudinary asset', async () => {
      mockCandidateRepo.findOneBy.mockResolvedValue({ candidateId: 'C0001' });
      const existingResume = {
        resumeId: '1',
        candidateId: 'C0001',
        cloudinaryPublicId: 'smart-recruitment-analytics/resumes/C0001_old',
        originalFilename: 'old.pdf',
        mimeType: 'application/pdf',
        fileSize: 111,
        cloudinaryUrl: 'https://old-url',
      };
      mockResumeRepo.findOneBy.mockResolvedValue(existingResume);
      mockSuccessfulUploadStream('smart-recruitment-analytics/resumes/C0001_new');
      mockResumeRepo.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      const result = await service.upload('C0001', fakeFile());

      expect(result.cloudinaryPublicId).toBe(
        'smart-recruitment-analytics/resumes/C0001_new',
      );
      expect(mockResumeRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when candidate has no resume', async () => {
      mockCandidateRepo.findOneBy.mockResolvedValue({ candidateId: 'C0001' });
      mockResumeRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('C0001')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns the resume when it exists', async () => {
      mockCandidateRepo.findOneBy.mockResolvedValue({ candidateId: 'C0001' });
      const resume = { resumeId: '1', candidateId: 'C0001' };
      mockResumeRepo.findOneBy.mockResolvedValue(resume);

      await expect(service.findOne('C0001')).resolves.toEqual(resume);
    });
  });

  describe('remove', () => {
    it('deletes the Cloudinary asset and the metadata row', async () => {
      mockCandidateRepo.findOneBy.mockResolvedValue({ candidateId: 'C0001' });
      const resume = {
        resumeId: '1',
        candidateId: 'C0001',
        cloudinaryPublicId: 'smart-recruitment-analytics/resumes/C0001_1',
      };
      mockResumeRepo.findOneBy.mockResolvedValue(resume);

      await service.remove('C0001');

      expect(mockCloudinary.uploader.destroy).toHaveBeenCalledWith(
        resume.cloudinaryPublicId,
        { resource_type: 'raw' },
      );
      expect(mockResumeRepo.remove).toHaveBeenCalledWith(resume);
    });
  });
});
