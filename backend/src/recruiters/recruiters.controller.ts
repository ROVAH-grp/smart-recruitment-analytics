import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RecruitersService } from './recruiters.service';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { QueryRecruiterDto } from './dto/query-recruiter.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Recruiters')
@Controller('recruiters')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecruitersController {
  constructor(
    private readonly recruitersService: RecruitersService,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({
    summary: 'List recruiters with search and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of recruiters',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  findAll(@Query() query: QueryRecruiterDto) {
    return this.recruitersService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({
    summary: 'Get a recruiter by id',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Recruiter found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  @ApiResponse({
    status: 404,
    description: 'Recruiter not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recruitersService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create a recruiter',
  })
  @ApiResponse({
    status: 201,
    description: 'Recruiter created',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  @ApiResponse({
    status: 409,
    description: 'Recruiter already exists',
  })
  create(@Body() dto: CreateRecruiterDto) {
    return this.recruitersService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update a recruiter',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Recruiter updated',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  @ApiResponse({
    status: 404,
    description: 'Recruiter not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRecruiterDto,
  ) {
    return this.recruitersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a recruiter',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Recruiter deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  @ApiResponse({
    status: 404,
    description: 'Recruiter not found',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.recruitersService.remove(id);

    return {
      message: `Recruiter "${id}" deleted successfully`,
    };
  }
}