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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JoiningRecordsService } from './joining-records.service';
import { CreateJoiningRecordDto } from './dto/create-joining-record.dto';
import { UpdateJoiningRecordDto } from './dto/update-joining-record.dto';
import { QueryJoiningRecordDto } from './dto/query-joining-record.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Joining Records')
@Controller('joining-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JoiningRecordsController {
  constructor(
    private readonly joiningRecordsService: JoiningRecordsService,
  ) {}

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.RECRUITER,
    UserRole.CANDIDATE,
  )
  @ApiOperation({
    summary: 'List joining records with filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of joining records',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findAll(@Query() query: QueryJoiningRecordDto) {
    return this.joiningRecordsService.findAll(query);
  }

  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.RECRUITER,
    UserRole.CANDIDATE,
  )
  @ApiOperation({ summary: 'Get a joining record by id' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Joining record found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Joining record not found' })
  findOne(@Param('id') id: string) {
    return this.joiningRecordsService.findOne(id);
  }

  @Post()
  @Roles(
    UserRole.ADMIN,
    UserRole.RECRUITER,
  )
  @ApiOperation({ summary: 'Create a joining record' })
  @ApiResponse({ status: 201, description: 'Joining record created' })
  @ApiResponse({ status: 400, description: 'Invalid application reference' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({
    status: 409,
    description: 'Joining record already exists for application',
  })
  create(@Body() dto: CreateJoiningRecordDto) {
    return this.joiningRecordsService.create(dto);
  }

  @Patch(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.RECRUITER,
  )
  @ApiOperation({ summary: 'Update a joining record' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Joining record updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Joining record not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateJoiningRecordDto,
  ) {
    return this.joiningRecordsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a joining record' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Joining record deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Joining record not found' })
  async remove(@Param('id') id: string) {
    await this.joiningRecordsService.remove(id);

    return {
      message: `Joining record "${id}" deleted successfully`,
    };
  }
}