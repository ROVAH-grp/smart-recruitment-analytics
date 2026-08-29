import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AnalyticsFilterDto } from './dto/analytics-filter.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Overall recruitment dashboard KPIs' })
  @ApiResponse({ status: 200, description: 'Dashboard KPI summary' })
  getDashboard(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getDashboard(filters);
  }

  @Get('funnel')
  @ApiOperation({ summary: 'Recruitment funnel stage counts and conversion rates' })
  @ApiResponse({ status: 200, description: 'Funnel stages with conversion rates' })
  getFunnel(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getFunnel(filters);
  }

  @Get('by-department')
  @ApiOperation({ summary: 'Recruitment performance grouped by department' })
  @ApiResponse({ status: 200, description: 'Per-department analytics' })
  getByDepartment(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getByDepartment(filters);
  }

  @Get('by-department/cost')
  @ApiOperation({ summary: 'Recruitment cost analytics grouped by department' })
  @ApiResponse({ status: 200, description: 'Per-department cost analytics' })
  getByDepartmentCost(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getByDepartmentCost(filters);
  }

  @Get('by-source')
  @ApiOperation({ summary: 'Recruitment performance grouped by source' })
  @ApiResponse({ status: 200, description: 'Per-source analytics' })
  getBySource(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getBySource(filters);
  }

  @Get('by-source/cost')
  @ApiOperation({ summary: 'Recruitment cost analytics grouped by source' })
  @ApiResponse({ status: 200, description: 'Per-source cost analytics' })
  getBySourceCost(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getBySourceCost(filters);
  }

  @Get('by-education')
  @ApiOperation({ summary: 'Recruitment performance grouped by candidate education' })
  @ApiResponse({ status: 200, description: 'Per-education analytics' })
  getByEducation(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getByEducation(filters);
  }

  @Get('by-experience')
  @ApiOperation({ summary: 'Recruitment performance grouped by candidate experience bucket' })
  @ApiResponse({ status: 200, description: 'Per-experience-bucket analytics' })
  getByExperience(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getByExperience(filters);
  }

  @Get('by-match')
  @ApiOperation({ summary: 'Recruitment performance grouped by match-score bucket' })
  @ApiResponse({ status: 200, description: 'Per-match-bucket analytics' })
  getByMatch(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getByMatch(filters);
  }

  @Get('by-recruiter')
  @ApiOperation({ summary: 'Recruitment performance grouped by recruiter' })
  @ApiResponse({ status: 200, description: 'Per-recruiter analytics' })
  getByRecruiter(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getByRecruiter(filters);
  }

  @Get('monthly-hiring')
  @ApiOperation({ summary: 'Number of hires per joining month' })
  @ApiResponse({ status: 200, description: 'Monthly hiring counts' })
  getMonthlyHiring(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getMonthlyHiring(filters);
  }

  @Get('kpis')
  @ApiOperation({ summary: 'Named recruitment KPI summary' })
  @ApiResponse({ status: 200, description: 'KPI summary' })
  getKpis(@Query() filters: AnalyticsFilterDto) {
    return this.analyticsService.getKpis(filters);
  }
}
