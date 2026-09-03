import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User, UserRole } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email.toLowerCase() },
    });

  if (existingUser) {
  throw new ConflictException('Email is already registered');
}

if (registerDto.role === UserRole.ADMIN) {
  throw new ForbiddenException(
    'Admin accounts cannot be created through public registration',
  );
}

if (
  registerDto.role === UserRole.CANDIDATE &&
  !registerDto.candidateId
) {
      throw new ConflictException(
        'Recruiter ID is required for recruiter registration',
      );
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      email: registerDto.email.toLowerCase(),
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
