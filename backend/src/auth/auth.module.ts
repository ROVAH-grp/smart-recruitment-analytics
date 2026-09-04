import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

import { Candidate } from '../candidates/entities/candidate.entity';
import { Recruiter } from '../recruiters/entities/recruiter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
  User,
  Candidate,
  Recruiter,
]),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'smart-recruitment-dev-secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
  ],

  exports: [
    AuthService,
    JwtModule,
  ],
})
export class AuthModule {}