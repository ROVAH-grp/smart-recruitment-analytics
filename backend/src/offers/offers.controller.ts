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

import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { QueryOfferDto } from './dto/query-offer.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Offers')
@Controller('offers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.RECRUITER,
    UserRole.CANDIDATE,
  )
  @ApiOperation({ summary: 'List offers with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of offers' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findAll(@Query() query: QueryOfferDto) {
    return this.offersService.findAll(query);
  }

  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.RECRUITER,
    UserRole.CANDIDATE,
  )
  @ApiOperation({ summary: 'Get an offer by id' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Offer found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Post()
  @Roles(
    UserRole.ADMIN,
    UserRole.RECRUITER,
  )
  @ApiOperation({ summary: 'Create an offer record' })
  @ApiResponse({ status: 201, description: 'Offer created' })
  @ApiResponse({ status: 400, description: 'Invalid application reference' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 409, description: 'Offer already exists for application' })
  create(@Body() dto: CreateOfferDto) {
    return this.offersService.create(dto);
  }

  @Patch(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.RECRUITER,
  )
  @ApiOperation({ summary: 'Update an offer' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Offer updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOfferDto,
  ) {
    return this.offersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an offer' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiResponse({ status: 200, description: 'Offer deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  async remove(@Param('id') id: string) {
    await this.offersService.remove(id);

    return {
      message: `Offer "${id}" deleted successfully`,
    };
  }
}