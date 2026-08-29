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
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { QueryOfferDto } from './dto/query-offer.dto';

@ApiTags('Offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @ApiOperation({ summary: 'List offers with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of offers' })
  findAll(@Query() query: QueryOfferDto) {
    return this.offersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an offer by id' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Offer found' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create an offer record' })
  @ApiResponse({ status: 201, description: 'Offer created' })
  @ApiResponse({ status: 400, description: 'Invalid application reference' })
  @ApiResponse({ status: 409, description: 'Offer already exists for application' })
  create(@Body() dto: CreateOfferDto) {
    return this.offersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an offer' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Offer updated' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  update(@Param('id') id: string, @Body() dto: UpdateOfferDto) {
    return this.offersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an offer' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Offer deleted' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  async remove(@Param('id') id: string) {
    await this.offersService.remove(id);
    return { message: `Offer "${id}" deleted successfully` };
  }
}
