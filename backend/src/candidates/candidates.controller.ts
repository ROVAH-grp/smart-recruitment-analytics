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

import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { QueryCandidateDto } from './dto/query-candidate.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Candidates')
@ApiBearerAuth('JWT-auth')
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'List candidates with search, filter and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of candidates' })
  findAll(@Query() query: QueryCandidateDto) {
    return this.candidatesService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER, UserRole.CANDIDATE)
  @ApiOperation({ summary: 'Get a candidate by id' })
  @ApiParam({ name: 'id', example: 'C0001' })
  @ApiResponse({ status: 200, description: 'Candidate found' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  findOne(@Param('id') id: string, @Request() request: any) {
  const user = request.user;

  if (
    user.role === UserRole.CANDIDATE &&
    user.candidateId !== id
  ) {
    throw new ForbiddenException(
      'You can only access your own candidate profile',
    );
  }

  return this.candidatesService.findOne(id);
}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Create a candidate' })
  @ApiResponse({ status: 201, description: 'Candidate created' })
  @ApiResponse({ status: 409, description: 'Candidate id already exists' })
  create(@Body() dto: CreateCandidateDto) {
    return this.candidatesService.create(dto);
  }

  @Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RECRUITER, UserRole.CANDIDATE)
@ApiOperation({ summary: 'Update a candidate' })
@ApiParam({ name: 'id', example: 'C0001' })
@ApiResponse({ status: 200, description: 'Candidate updated' })
@ApiResponse({ status: 403, description: 'Access denied' })
@ApiResponse({ status: 404, description: 'Candidate not found' })
update(
  @Param('id') id: string,
  @Body() dto: UpdateCandidateDto,
  @Request() request: any,
) {
  const user = request.user;

  if (
    user.role === UserRole.CANDIDATE &&
    user.candidateId !== id
  ) {
    throw new ForbiddenException(
      'You can only update your own candidate profile',
    );
  }

  return this.candidatesService.update(id, dto);
}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a candidate' })
  @ApiParam({ name: 'id', example: 'C0001' })
  @ApiResponse({ status: 200, description: 'Candidate deleted' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  async remove(@Param('id') id: string) {
    await this.candidatesService.remove(id);
    return { message: `Candidate "${id}" deleted successfully` };
  }
}