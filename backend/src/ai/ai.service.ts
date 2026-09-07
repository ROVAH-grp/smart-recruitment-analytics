import {
  BadGatewayException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ParsedResume {
  name: string;
  skills: string[];
  education: string[];
  projects: string[];
}

export interface ResumeRanking {
  candidate_name: string;
  resume_file: string;
  overall_score: number;
  breakdown: {
    skills_score: number;
    experience_score: number;
    education_score: number;
    certifications_score: number;
    projects_score: number;
  };
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly aiServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.aiServiceUrl =
      this.configService.get<string>('AI_SERVICE_URL') ??
      'http://127.0.0.1:8000';
  }

  async parseResume(
    file: Express.Multer.File,
  ): Promise<ParsedResume> {
    try {
      const formData = new FormData();

      formData.append(
        'file',
        new Blob([new Uint8Array(file.buffer)], {
          type: file.mimetype,
        }),
        file.originalname,
      );

      const response = await fetch(
        `${this.aiServiceUrl}/parse-resume`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        this.logger.error(
          `AI parse-resume failed: ${response.status} ${errorText}`,
        );

        throw new BadGatewayException(
          'AI resume parsing service failed.',
        );
      }

      return (await response.json()) as ParsedResume;
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      this.logger.error(
        `Could not connect to AI service: ${(error as Error).message}`,
      );

      throw new BadGatewayException(
        'AI resume parsing service is unavailable.',
      );
    }
  }

  async rankResume(
    file: Express.Multer.File,
    jobRequirement: Record<string, unknown>,
  ): Promise<ResumeRanking> {
    try {
      const formData = new FormData();

      formData.append(
        'files',
        new Blob([new Uint8Array(file.buffer)], {
          type: file.mimetype,
        }),
        file.originalname,
      );

      formData.append(
        'job_requirement',
        JSON.stringify(jobRequirement),
      );

      const response = await fetch(
        `${this.aiServiceUrl}/rank-candidates`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        this.logger.error(
          `AI rank-candidates failed: ${response.status} ${errorText}`,
        );

        throw new BadGatewayException(
          'AI resume ranking service failed.',
        );
      }

      const result =
        (await response.json()) as ResumeRanking[];

      if (!result.length) {
        throw new BadGatewayException(
          'AI ranking service returned no result.',
        );
      }

      return result[0];
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      this.logger.error(
        `Could not connect to AI ranking service: ${
          (error as Error).message
        }`,
      );

      throw new BadGatewayException(
        'AI resume ranking service is unavailable.',
      );
    }
  }
}