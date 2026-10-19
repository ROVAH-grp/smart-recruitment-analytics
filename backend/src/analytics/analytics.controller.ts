import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AnalyticsService } from './analytics.service';
import { AnalyticsFilterDto } from './dto/analytics-filter.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RECRUITER)
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Overall recruitment dashboard KPIs' })
  @ApiResponse({ status: 200, description: 'Dashboard KPI summary' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getDashboard(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getDashboard(filters);
  }

  @Get('funnel')
  @ApiOperation({
    summary: 'Recruitment funnel stage counts and conversion rates',
  })
  @ApiResponse({
    status: 200,
    description: 'Funnel stages with conversion rates',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getFunnel(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getFunnel(filters);
  }

  @Get('by-department')
  @ApiOperation({
    summary: 'Recruitment performance grouped by department',
  })
  @ApiResponse({
    status: 200,
    description: 'Per-department analytics',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getByDepartment(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getByDepartment(filters);
  }

  @Get('by-department/cost')
  @ApiOperation({
    summary: 'Recruitment cost analytics grouped by department',
  })
  @ApiResponse({
    status: 200,
    description: 'Per-department cost analytics',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getByDepartmentCost(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getByDepartmentCost(filters);
  }

  @Get('by-source')
  @ApiOperation({
    summary: 'Recruitment performance grouped by source',
  })
  @ApiResponse({
    status: 200,
    description: 'Per-source analytics',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getBySource(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getBySource(filters);
  }

  @Get('by-source/cost')
  @ApiOperation({
    summary: 'Recruitment cost analytics grouped by source',
  })
  @ApiResponse({
    status: 200,
    description: 'Per-source cost analytics',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getBySourceCost(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getBySourceCost(filters);
  }

  @Get('by-education')
  @ApiOperation({
    summary: 'Recruitment performance grouped by candidate education',
  })
  @ApiResponse({
    status: 200,
    description: 'Per-education analytics',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getByEducation(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getByEducation(filters);
  }

  @Get('by-experience')
  @ApiOperation({
    summary:
      'Recruitment performance grouped by candidate experience bucket',
  })
  @ApiResponse({
    status: 200,
    description: 'Per-experience-bucket analytics',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getByExperience(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getByExperience(filters);
  }

  @Get('by-match')
  @ApiOperation({
    summary:
      'Recruitment performance grouped by match-score bucket',
  })
  @ApiResponse({
    status: 200,
    description: 'Per-match-bucket analytics',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getByMatch(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getByMatch(filters);
  }

  @Get('by-recruiter')
  @ApiOperation({
    summary: 'Recruitment performance grouped by recruiter',
  })
  @ApiResponse({
    status: 200,
    description: 'Per-recruiter analytics',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getByRecruiter(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getByRecruiter(filters);
  }

  @Get('monthly-hiring')
  @ApiOperation({
    summary: 'Number of hires per joining month',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly hiring counts',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getMonthlyHiring(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getMonthlyHiring(filters);
  }

  @Get('kpis')
  @ApiOperation({
    summary: 'Named recruitment KPI summary',
  })
  @ApiResponse({
    status: 200,
    description: 'KPI summary',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getKpis(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getKpis(filters);
  }
}