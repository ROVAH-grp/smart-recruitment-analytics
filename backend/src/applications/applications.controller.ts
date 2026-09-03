import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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

import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { QueryApplicationDto } from './dto/query-application.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Applications')
@ApiBearerAuth('JWT-auth')
@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER, UserRole.CANDIDATE)
  @ApiOperation({ summary: 'List applications with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of applications' })
  findAll(
    @Query() query: QueryApplicationDto,
    @Request() request: any,
  ) {
    const user = request.user;

    // Candidates can only see their own applications.
    if (user.role === UserRole.CANDIDATE) {
      query.candidateId = user.candidateId;
    }

    return this.applicationsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER, UserRole.CANDIDATE)
  @ApiOperation({ summary: 'Get an application by id' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Application found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async findOne(
    @Param('id') id: string,
    @Request() request: any,
  ) {
    const application = await this.applicationsService.findOne(id);
    const user = request.user;

    // Candidates can only view their own applications.
    if (
      user.role === UserRole.CANDIDATE &&
      application.candidateId !== user.candidateId
    ) {
      throw new ForbiddenException(
        'You can only access your own applications',
      );
    }

    return application;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Create an application' })
  @ApiResponse({ status: 201, description: 'Application created' })
  @ApiResponse({
    status: 400,
    description: 'Invalid candidate/job/recruiter/source reference',
  })
  create(@Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Update an application' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Application updated' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an application' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Application deleted' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async remove(@Param('id') id: string) {
    await this.applicationsService.remove(id);

    return {
      message: `Application "${id}" deleted successfully`,
    };
  }
}