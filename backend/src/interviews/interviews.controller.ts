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
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { QueryInterviewDto } from './dto/query-interview.dto';

@ApiTags('Interviews')
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Get()
  @ApiOperation({ summary: 'List interviews with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of interviews' })
  findAll(@Query() query: QueryInterviewDto) {
    return this.interviewsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an interview by id' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Interview found' })
  @ApiResponse({ status: 404, description: 'Interview not found' })
  findOne(@Param('id') id: string) {
    return this.interviewsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create an interview record' })
  @ApiResponse({ status: 201, description: 'Interview created' })
  @ApiResponse({ status: 400, description: 'Invalid application reference' })
  @ApiResponse({ status: 409, description: 'Interview already exists for application' })
  create(@Body() dto: CreateInterviewDto) {
    return this.interviewsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an interview' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Interview updated' })
  @ApiResponse({ status: 404, description: 'Interview not found' })
  update(@Param('id') id: string, @Body() dto: UpdateInterviewDto) {
    return this.interviewsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an interview' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Interview deleted' })
  @ApiResponse({ status: 404, description: 'Interview not found' })
  async remove(@Param('id') id: string) {
    await this.interviewsService.remove(id);
    return { message: `Interview "${id}" deleted successfully` };
  }
}
