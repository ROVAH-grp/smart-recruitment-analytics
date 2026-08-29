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
import { JoiningRecordsService } from './joining-records.service';
import { CreateJoiningRecordDto } from './dto/create-joining-record.dto';
import { UpdateJoiningRecordDto } from './dto/update-joining-record.dto';
import { QueryJoiningRecordDto } from './dto/query-joining-record.dto';

@ApiTags('Joining Records')
@Controller('joining-records')
export class JoiningRecordsController {
  constructor(private readonly joiningRecordsService: JoiningRecordsService) {}

  @Get()
  @ApiOperation({ summary: 'List joining records with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of joining records' })
  findAll(@Query() query: QueryJoiningRecordDto) {
    return this.joiningRecordsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a joining record by id' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Joining record found' })
  @ApiResponse({ status: 404, description: 'Joining record not found' })
  findOne(@Param('id') id: string) {
    return this.joiningRecordsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a joining record' })
  @ApiResponse({ status: 201, description: 'Joining record created' })
  @ApiResponse({ status: 400, description: 'Invalid application reference' })
  @ApiResponse({ status: 409, description: 'Joining record already exists for application' })
  create(@Body() dto: CreateJoiningRecordDto) {
    return this.joiningRecordsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a joining record' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Joining record updated' })
  @ApiResponse({ status: 404, description: 'Joining record not found' })
  update(@Param('id') id: string, @Body() dto: UpdateJoiningRecordDto) {
    return this.joiningRecordsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a joining record' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Joining record deleted' })
  @ApiResponse({ status: 404, description: 'Joining record not found' })
  async remove(@Param('id') id: string) {
    await this.joiningRecordsService.remove(id);
    return { message: `Joining record "${id}" deleted successfully` };
  }
}
