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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobDto } from './dto/query-job.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Jobs')
@ApiBearerAuth('JWT-auth')
@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.RECRUITER,
    UserRole.CANDIDATE,
  )
  @ApiOperation({ summary: 'List jobs with search, filter and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of jobs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findAll(@Query() query: QueryJobDto) {
    return this.jobsService.findAll(query);
  }

  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.RECRUITER,
    UserRole.CANDIDATE,
  )
  @ApiOperation({ summary: 'Get a job by id' })
  @ApiParam({ name: 'id', example: 'J001' })
  @ApiResponse({ status: 200, description: 'Job found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Post()
  @Roles(
    UserRole.ADMIN,
    UserRole.RECRUITER,
  )
  @ApiOperation({ summary: 'Create a job' })
  @ApiResponse({ status: 201, description: 'Job created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 409, description: 'Job id already exists' })
  create(@Body() dto: CreateJobDto) {
    return this.jobsService.create(dto);
  }

  @Patch(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.RECRUITER,
  )
  @ApiOperation({ summary: 'Update a job' })
  @ApiParam({ name: 'id', example: 'J001' })
  @ApiResponse({ status: 200, description: 'Job updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a job' })
  @ApiParam({ name: 'id', example: 'J001' })
  @ApiResponse({ status: 200, description: 'Job deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async remove(@Param('id') id: string) {
    await this.jobsService.remove(id);

    return {
      message: `Job "${id}" deleted successfully`,
    };
  }
}