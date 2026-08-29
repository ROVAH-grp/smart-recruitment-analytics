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
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecruitersService } from './recruiters.service';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { QueryRecruiterDto } from './dto/query-recruiter.dto';

@ApiTags('Recruiters')
@Controller('recruiters')
export class RecruitersController {
  constructor(private readonly recruitersService: RecruitersService) {}

  @Get()
  @ApiOperation({ summary: 'List recruiters with search and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of recruiters' })
  findAll(@Query() query: QueryRecruiterDto) {
    return this.recruitersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a recruiter by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Recruiter found' })
  @ApiResponse({ status: 404, description: 'Recruiter not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recruitersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a recruiter' })
  @ApiResponse({ status: 201, description: 'Recruiter created' })
  @ApiResponse({ status: 409, description: 'Recruiter already exists' })
  create(@Body() dto: CreateRecruiterDto) {
    return this.recruitersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a recruiter' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Recruiter updated' })
  @ApiResponse({ status: 404, description: 'Recruiter not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRecruiterDto,
  ) {
    return this.recruitersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a recruiter' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Recruiter deleted' })
  @ApiResponse({ status: 404, description: 'Recruiter not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.recruitersService.remove(id);
    return { message: `Recruiter "${id}" deleted successfully` };
  }
}
