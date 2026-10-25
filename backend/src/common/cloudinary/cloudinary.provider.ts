import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { AppConfig } from '../../config/configuration';

export const CLOUDINARY = 'CLOUDINARY';

/**
 * Provides a configured Cloudinary SDK instance for DI. Configuration is
 * read exclusively from environment variables via ConfigService — never
 * hardcoded, and the API secret is never sent to any client-facing DTO.
 */
export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  inject: [ConfigService],
  useFactory: (configService: ConfigService<AppConfig, true>) => {
    cloudinary.config({
      cloud_name: configService.get('cloudinary.cloudName', { infer: true }),
      api_key: configService.get('cloudinary.apiKey', { infer: true }),
      api_secret: configService.get('cloudinary.apiSecret', { infer: true }),
    });
    return cloudinary;
  },
};
