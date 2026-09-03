import { ApiProperty } from '@nestjs/swagger';

export class ResumeResponseDto {
  @ApiProperty({ example: '17' })
  resumeId: string;

  @ApiProperty({ example: 'C0001' })
  candidateId: string;

  @ApiProperty({ example: 'rahul_sharma_resume.pdf' })
  originalFilename: string;

  @ApiProperty({ example: 'application/pdf' })
  mimeType: string;

  @ApiProperty({ example: 245678, description: 'File size in bytes' })
  fileSize: number;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/demo/raw/upload/v1234567890/smart-recruitment-analytics/resumes/C0001_1234567890-123456789.pdf',
  })
  cloudinaryUrl: string;

  @ApiProperty()
  uploadedAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
