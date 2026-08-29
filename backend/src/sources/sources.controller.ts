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
import { SourcesService } from './sources.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { QuerySourceDto } from './dto/query-source.dto';

@ApiTags('Sources')
@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Get()
  @ApiOperation({ summary: 'List recruitment sources with search and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of sources' })
  findAll(@Query() query: QuerySourceDto) {
    return this.sourcesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a source by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Source found' })
  @ApiResponse({ status: 404, description: 'Source not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sourcesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a source' })
  @ApiResponse({ status: 201, description: 'Source created' })
  @ApiResponse({ status: 409, description: 'Source already exists' })
  create(@Body() dto: CreateSourceDto) {
    return this.sourcesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a source' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Source updated' })
  @ApiResponse({ status: 404, description: 'Source not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSourceDto) {
    return this.sourcesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a source' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Source deleted' })
  @ApiResponse({ status: 404, description: 'Source not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.sourcesService.remove(id);
    return { message: `Source "${id}" deleted successfully` };
  }
}
