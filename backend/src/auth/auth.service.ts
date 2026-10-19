import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Candidate } from '../candidates/entities/candidate.entity';
import { Recruiter } from '../recruiters/entities/recruiter.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User, UserRole } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,

  @InjectRepository(Candidate)
  private readonly candidateRepository: Repository<Candidate>,

  @InjectRepository(Recruiter)
  private readonly recruiterRepository: Repository<Recruiter>,

  private readonly jwtService: JwtService,
) {}

async register(registerDto: RegisterDto) {
  const email = registerDto.email.toLowerCase();

  const existingUser = await this.userRepository.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictException('Email is already registered');
  }

  // Admin accounts must be created by an authorized administrator.
  if (registerDto.role === UserRole.ADMIN) {
    throw new ForbiddenException(
      'Admin accounts cannot be created through public registration',
    );
  }

  // Candidate registration requires a valid candidate ID.
  if (
    registerDto.role === UserRole.CANDIDATE &&
    !registerDto.candidateId
  ) {
    throw new BadRequestException(
      'Candidate ID is required for candidate registration',
    );
  }

  if (
  registerDto.role === UserRole.CANDIDATE &&
  registerDto.candidateId
) {
  const candidate = await this.candidateRepository.findOne({
    where: {
      candidateId: registerDto.candidateId,
    },
  });

  if (!candidate) {
    throw new BadRequestException(
      `Candidate with ID "${registerDto.candidateId}" does not exist`,
    );
  }
}

  // Recruiter registration requires a recruiter ID.
  if (
    registerDto.role === UserRole.RECRUITER &&
    !registerDto.recruiterId
  ) {
    throw new BadRequestException(
      'Recruiter ID is required for recruiter registration',
    );
  }

  if (
  registerDto.role === UserRole.RECRUITER &&
  registerDto.recruiterId
) {
  const recruiter = await this.recruiterRepository.findOne({
    where: {
      recruiterId: registerDto.recruiterId,
    },
  });

  if (!recruiter) {
    throw new BadRequestException(
      `Recruiter with ID "${registerDto.recruiterId}" does not exist`,
    );
  }
}

  const passwordHash = await bcrypt.hash(
    registerDto.password,
    10,
  );

  const user = this.userRepository.create({
    email,
    passwordHash,
    role: registerDto.role,

    candidateId:
      registerDto.role === UserRole.CANDIDATE
        ? registerDto.candidateId ?? null
        : null,

    recruiterId:
      registerDto.role === UserRole.RECRUITER
        ? registerDto.recruiterId ?? null
        : null,
  });

  const savedUser = await this.userRepository.save(user);

  return {
    message: 'Registration successful',
    user: this.sanitizeUser(savedUser),
  };
}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
      candidateId: user.candidateId,
      recruiterId: user.recruiterId,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: this.sanitizeUser(user),
    };
  }

    async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    // Do not reveal whether the email exists.
    if (!user) {
      return {
        message:
          'If an account exists with this email, a password reset link has been generated.',
      };
    }

    const resetToken = randomBytes(32).toString('hex');

    user.resetToken = resetToken;
    user.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.userRepository.save(user);

    return {
      message:
        'If an account exists with this email, a password reset link has been generated.',
      resetToken,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
  const { token, newPassword } = resetPasswordDto;

  const user = await this.userRepository.findOne({
    where: { resetToken: token },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid or expired reset token');
  }

  if (
    !user.resetTokenExpiresAt ||
    user.resetTokenExpiresAt.getTime() < Date.now()
  ) {
    throw new UnauthorizedException('Invalid or expired reset token');
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);

  user.resetToken = null;
  user.resetTokenExpiresAt = null;

  await this.userRepository.save(user);

  return {
    message: 'Password reset successful',
  };
}

  async validateUser(userId: number) {
    return this.userRepository.findOne({
      where: { userId },
    });
  }

  private sanitizeUser(user: User) {
    return {
      userId: user.userId,
      email: user.email,
      role: user.role,
      candidateId: user.candidateId,
      recruiterId: user.recruiterId,
      createdAt: user.createdAt,
    };
  }
}
