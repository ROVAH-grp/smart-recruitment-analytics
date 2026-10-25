import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { QueryInterviewDto } from './dto/query-interview.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Interviews')
@ApiBearerAuth('JWT-auth')
@Controller('interviews')
export class InterviewsController {
  constructor(
    private readonly interviewsService: InterviewsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER, UserRole.CANDIDATE)
  @ApiOperation({ summary: 'List interviews with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of interviews' })
  findAll(
    @Query() query: QueryInterviewDto,
    @Request() request: any,
  ) {
    const user = request.user;

    if (user.role === UserRole.CANDIDATE) {
      return this.interviewsService.findAll(
        query,
        user.candidateId,
      );
    }

    return this.interviewsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER, UserRole.CANDIDATE)
  @ApiOperation({ summary: 'Get an interview by id' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Interview found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Interview not found' })
  findOne(
    @Param('id') id: string,
    @Request() request: any,
  ) {
    const user = request.user;

    if (user.role === UserRole.CANDIDATE) {
      return this.interviewsService.findOne(
        id,
        user.candidateId,
      );
    }

    return this.interviewsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Create an interview record' })
  @ApiResponse({ status: 201, description: 'Interview created' })
  @ApiResponse({
    status: 400,
    description: 'Invalid application reference',
  })
  @ApiResponse({
    status: 409,
    description: 'Interview already exists for application',
  })
  create(@Body() dto: CreateInterviewDto) {
    return this.interviewsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Update an interview' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Interview updated' })
  @ApiResponse({ status: 404, description: 'Interview not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInterviewDto,
  ) {
    return this.interviewsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an interview' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Interview deleted' })
  @ApiResponse({ status: 404, description: 'Interview not found' })
  async remove(@Param('id') id: string) {
    await this.interviewsService.remove(id);

    return {
      message: `Interview "${id}" deleted successfully`,
    };
  }
}