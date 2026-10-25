import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { memoryStorage } from 'multer';

import { ResumesService } from './resumes.service';
import { ResumeResponseDto } from './dto/resume-response.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.docx'];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function resumeFileFilter(
  _req: unknown,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  const dotIndex = file.originalname.lastIndexOf('.');

  const extension =
    dotIndex >= 0 ? file.originalname.slice(dotIndex).toLowerCase() : '';

  const mimeAllowed = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extensionAllowed = ALLOWED_EXTENSIONS.includes(extension);

  if (!mimeAllowed || !extensionAllowed) {
    return callback(
      new BadRequestException('Only PDF and DOCX resumes are accepted.'),
      false,
    );
  }

  callback(null, true);
}

@ApiTags('Resumes')
@Controller('candidates/:candidateId')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  /*
   * ============================================================
   * APPLICATION-SPECIFIC RESUME UPLOAD
   * ============================================================
   *
   * POST /candidates/:candidateId/applications/:applicationId/resume
   *
   * Used by the candidate application flow.
   */
  @Post('applications/:applicationId/resume')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
      fileFilter: resumeFileFilter,
    }),
  )
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'candidateId',
    example: 'C0001',
  })
  @ApiParam({
    name: 'applicationId',
    example: '1',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'PDF or DOCX resume file, max 5 MB.',
        },
      },
      required: ['file'],
    },
  })
  @ApiOperation({
    summary: 'Upload a resume for a job application',
    description:
      'Uploads a candidate resume to Cloudinary and links it to the specified application. ' +
      'A candidate can only upload a resume for their own application. ' +
      'Uploading another resume for the same application replaces the previous resume.',
  })
  @ApiResponse({
    status: 201,
    description: 'Application resume uploaded and ATS score generated.',
    type: ResumeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid file type, no file, or application ownership error.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Only candidates can use this endpoint.',
  })
  @ApiResponse({
    status: 404,
    description: 'Candidate or application not found.',
  })
  @ApiResponse({
    status: 413,
    description: 'File exceeds the 5 MB limit.',
  })
  uploadForApplication(
    @Param('candidateId') candidateId: string,
    @Param('applicationId') applicationId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() request: any,
  ) {
    if (
      request.user.role === UserRole.CANDIDATE &&
      request.user.candidateId !== candidateId
    ) {
      throw new BadRequestException(
        'You can only upload a resume for your own candidate profile.',
      );
    }

    return this.resumesService.uploadForApplication(
      applicationId,
      candidateId,
      file,
    );
  }

  /*
   * ============================================================
   * LEGACY: CANDIDATE-LEVEL RESUME UPLOAD
   * ============================================================
   *
   * POST /candidates/:candidateId/resume
   *
   * Kept for backward compatibility.
   */
  @Post('resume')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
      fileFilter: resumeFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'candidateId',
    example: 'C0001',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'PDF or DOCX resume file, max 5 MB.',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload (or replace) a candidate resume',
    description:
      'Legacy candidate-level resume upload. New applications should use the application-specific resume endpoint.',
  })
  @ApiResponse({
    status: 201,
    description: 'Resume uploaded and stored.',
    type: ResumeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type, or no file provided.',
  })
  @ApiResponse({
    status: 404,
    description: 'Candidate not found.',
  })
  @ApiResponse({
    status: 413,
    description: 'File exceeds the 5 MB limit.',
  })
  upload(
    @Param('candidateId') candidateId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.resumesService.upload(candidateId, file);
  }

  /*
   * ============================================================
   * GET CANDIDATE RESUME
   * ============================================================
   *
   * GET /candidates/:candidateId/resume
   */
  @Get('resume')
  @ApiOperation({
    summary: "Get a candidate's resume metadata and URL",
  })
  @ApiParam({
    name: 'candidateId',
    example: 'C0001',
  })
  @ApiResponse({
    status: 200,
    description: 'Resume metadata.',
    type: ResumeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Candidate not found, or candidate has no resume.',
  })
  findOne(@Param('candidateId') candidateId: string) {
    return this.resumesService.findOne(candidateId);
  }

  /*
   * ============================================================
   * DELETE CANDIDATE RESUME
   * ============================================================
   *
   * DELETE /candidates/:candidateId/resume
   */
  @Delete('resume')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete a candidate's resume",
  })
  @ApiParam({
    name: 'candidateId',
    example: 'C0001',
  })
  @ApiResponse({
    status: 204,
    description: 'Resume deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Candidate not found, or candidate has no resume.',
  })
  remove(@Param('candidateId') candidateId: string) {
    return this.resumesService.remove(candidateId);
  }
}