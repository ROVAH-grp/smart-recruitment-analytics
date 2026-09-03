import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
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
@Controller('candidates/:candidateId/resume')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // never written to disk/repo
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
      fileFilter: resumeFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'candidateId', example: 'C0001' })
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
      'Uploads a PDF or DOCX resume to Cloudinary and stores its metadata ' +
      'in MySQL. If the candidate already has a resume, it is replaced: ' +
      'the old Cloudinary asset is removed and the metadata row is updated ' +
      'in place rather than creating a second record.',
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
  @ApiResponse({ status: 404, description: 'Candidate not found.' })
  @ApiResponse({ status: 413, description: 'File exceeds the 5 MB limit.' })
  upload(
    @Param('candidateId') candidateId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.resumesService.upload(candidateId, file);
  }

  @Get()
  @ApiOperation({ summary: "Get a candidate's resume metadata and URL" })
  @ApiParam({ name: 'candidateId', example: 'C0001' })
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

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a candidate's resume" })
  @ApiParam({ name: 'candidateId', example: 'C0001' })
  @ApiResponse({ status: 204, description: 'Resume deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Candidate not found, or candidate has no resume.',
  })
  remove(@Param('candidateId') candidateId: string) {
    return this.resumesService.remove(candidateId);
  }
}
