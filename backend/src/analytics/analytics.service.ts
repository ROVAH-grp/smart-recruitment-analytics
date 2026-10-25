import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AnalyticsFilterDto } from './dto/analytics-filter.dto';

/**
 * Base FROM clause shared by every analytics query. All feature tables are
 * left-joined onto applications so a single filter set (department, source,
 * recruiter, jobId, education, status, date range) can be applied uniformly
 * regardless of which dimension the query is grouping/aggregating by.
 */
const BASE_FROM = `
  FROM applications a
  LEFT JOIN jobs j ON j.job_id = a.job_id
  LEFT JOIN candidates c ON c.candidate_id = a.candidate_id
  LEFT JOIN recruiters r ON r.recruiter_id = a.recruiter_id
  LEFT JOIN sources s ON s.source_id = a.source_id
  LEFT JOIN interviews i ON i.application_id = a.application_id
  LEFT JOIN offers o ON o.application_id = a.application_id
  LEFT JOIN joining_records jr ON jr.application_id = a.application_id
`;

interface WhereClause {
  sql: string;
  params: unknown[];
}

@Injectable()
export class AnalyticsService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /**
   * Builds a parameterized WHERE clause from the shared analytics filters.
   * `dateColumn` lets callers filter the start/end date range against a
   * different column (e.g. joining_date for monthly hiring) when relevant.
   */
  private buildWhere(
    filters: AnalyticsFilterDto,
    dateColumn: 'a.application_date' | 'a.joining_date' = 'a.application_date',
  ): WhereClause {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filters.department) {
      conditions.push('j.department LIKE ?');
      params.push(`%${filters.department}%`);
    }
    if (filters.source) {
      conditions.push('s.source_name LIKE ?');
      params.push(`%${filters.source}%`);
    }
    if (filters.recruiter) {
      conditions.push('r.recruiter_name LIKE ?');
      params.push(`%${filters.recruiter}%`);
    }
    if (filters.jobId) {
      conditions.push('a.job_id = ?');
      params.push(filters.jobId);
    }
    if (filters.education) {
      conditions.push('c.education LIKE ?');
      params.push(`%${filters.education}%`);
    }
    if (filters.status) {
      conditions.push('a.status = ?');
      params.push(filters.status);
    }
    if (filters.startDate) {
      conditions.push(`${dateColumn} >= ?`);
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      conditions.push(`${dateColumn} <= ?`);
      params.push(filters.endDate);
    }

    return {
      sql: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
      params,
    };
  }

  private async queryOne<T = any>(
    sql: string,
    params: unknown[],
  ): Promise<T> {
    const rows = await this.dataSource.query(sql, params);
    return rows[0];
  }

  /**
   * NULL-safe ratio helper: returns 0 instead of dividing by zero, and rounds
   * to 2 decimal places.
   */
  private ratio(numerator: number, denominator: number): number {
    if (!denominator) return 0;
    return Math.round((numerator / denominator) * 10000) / 100;
  }

  private round2(value: number | string | null): number {
    if (value === null || value === undefined) return 0;
    return Math.round(Number(value) * 100) / 100;
  }

  async getDashboard(filters: AnalyticsFilterDto) {
    const { sql: where, params } = this.buildWhere(filters);

    const summary = await this.queryOne(
      `
      SELECT
        COUNT(DISTINCT a.application_id) AS totalApplicants,
        COUNT(DISTINCT CASE WHEN a.joining_date IS NOT NULL THEN a.application_id END) AS totalJoined,
        AVG(i.overall_score) AS averageInterviewScore,
        AVG(CASE WHEN a.joining_date IS NOT NULL
              THEN DATEDIFF(a.joining_date, a.application_date) END) AS averageTimeToHire,
        AVG(CASE WHEN a.joining_date IS NOT NULL AND j.job_posted_date IS NOT NULL
              THEN DATEDIFF(a.joining_date, j.job_posted_date) END) AS averageTimeToFill,
        COUNT(DISTINCT o.offer_id) AS totalOffers,
        COUNT(DISTINCT CASE WHEN o.offer_status = 'Accepted' THEN o.offer_id END) AS acceptedOffers
      ${BASE_FROM}
      ${where}
      `,
      params,
    );

    const totalApplicants = Number(summary.totalApplicants) || 0;
    const totalJoined = Number(summary.totalJoined) || 0;
    const totalOffers = Number(summary.totalOffers) || 0;
    const acceptedOffers = Number(summary.acceptedOffers) || 0;

    return {
      totalApplicants,
      totalJoined,
      averageTimeToHire: this.round2(summary.averageTimeToHire),
      averageTimeToFill: this.round2(summary.averageTimeToFill),
      averageInterviewScore: this.round2(summary.averageInterviewScore),
      offerAcceptanceRate: this.ratio(acceptedOffers, totalOffers),
      hiringSuccessRate: this.ratio(totalJoined, totalApplicants),
    };
  }

  async getFunnel(filters: AnalyticsFilterDto) {
    const { sql: where, params } = this.buildWhere(filters);

    const row = await this.queryOne(
      `
      SELECT
        COUNT(DISTINCT a.application_id) AS applied,
        COUNT(DISTINCT CASE WHEN a.screening_date IS NOT NULL THEN a.application_id END) AS screened,
        COUNT(DISTINCT CASE WHEN a.shortlist_date IS NOT NULL THEN a.application_id END) AS shortlisted,
        COUNT(DISTINCT CASE WHEN a.interview_date IS NOT NULL THEN a.application_id END) AS interviewed,
        COUNT(DISTINCT CASE WHEN a.selection_date IS NOT NULL THEN a.application_id END) AS selected,
        COUNT(DISTINCT CASE WHEN a.offer_date IS NOT NULL THEN a.application_id END) AS offered,
        COUNT(DISTINCT CASE WHEN a.joining_date IS NOT NULL THEN a.application_id END) AS joined
      ${BASE_FROM}
      ${where}
      `,
      params,
    );

    const applied = Number(row.applied) || 0;
    const stageOrder = [
      { stage: 'Applied', candidates: applied },
      { stage: 'Screened', candidates: Number(row.screened) || 0 },
      { stage: 'Shortlisted', candidates: Number(row.shortlisted) || 0 },
      { stage: 'Interviewed', candidates: Number(row.interviewed) || 0 },
      { stage: 'Selected', candidates: Number(row.selected) || 0 },
      { stage: 'Offered', candidates: Number(row.offered) || 0 },
      { stage: 'Joined', candidates: Number(row.joined) || 0 },
    ];

    return {
      stages: stageOrder.map((s) => ({
        stage: s.stage,
        candidates: s.candidates,
        conversionRate: this.ratio(s.candidates, applied),
      })),
    };
  }

  async getByDepartment(filters: AnalyticsFilterDto) {
    const { sql: where, params } = this.buildWhere(filters);
    const rows = await this.dataSource.query(
      `
      SELECT
        COALESCE(j.department, 'Unknown') AS department,
        COUNT(DISTINCT a.application_id) AS applicants,
        COUNT(DISTINCT CASE WHEN a.joining_date IS NOT NULL THEN a.application_id END) AS joined,
        AVG(i.overall_score) AS averageInterviewScore
      ${BASE_FROM}
      ${where}
      GROUP BY j.department
      ORDER BY applicants DESC
      `,
      params,
    );

    return rows.map((row: any) => {
      const applicants = Number(row.applicants) || 0;
      const joined = Number(row.joined) || 0;
      return {
        department: row.department,
        applicants,
        joined,
        hiringRate: this.ratio(joined, applicants),
        averageInterviewScore: this.round2(row.averageInterviewScore),
      };
    });
  }

  async getByDepartmentCost(filters: AnalyticsFilterDto) {
    const { sql: where, params } = this.buildWhere(filters);
    const rows = await this.dataSource.query(
      `
      SELECT
        COALESCE(j.department, 'Unknown') AS department,
        COUNT(DISTINCT a.application_id) AS applicants,
        COUNT(DISTINCT CASE WHEN a.joining_date IS NOT NULL THEN a.application_id END) AS joined,
        AVG(i.overall_score) AS averageInterviewScore,
        SUM(a.recruitment_cost) AS totalCost
      ${BASE_FROM}
      ${where}
      GROUP BY j.department
      ORDER BY applicants DESC
      `,
      params,
    );

    return rows.map((row: any) => {
      const applicants = Number(row.applicants) || 0;
      const joined = Number(row.joined) || 0;
      const totalCost = Number(row.totalCost) || 0;
      return {
        department: row.department,
        applicants,
        joined,
        hiringRate: this.ratio(joined, applicants),
        averageInterviewScore: this.round2(row.averageInterviewScore),
        totalCost: this.round2(totalCost),
        costPerHire: joined ? this.round2(totalCost / joined) : 0,
      };
    });
  }

  async getBySource(filters: AnalyticsFilterDto) {
    const { sql: where, params } = this.buildWhere(filters);
    const rows = await this.dataSource.query(
      `
      SELECT
        COALESCE(s.source_name, 'Unknown') AS source,
        COUNT(DISTINCT a.application_id) AS applicants,
        COUNT(DISTINCT CASE WHEN a.joining_date IS NOT NULL THEN a.application_id END) AS joined,
        AVG(i.overall_score) AS averageInterviewScore
      ${BASE_FROM}
      ${where}
      GROUP BY s.source_name
      ORDER BY applicants DESC
      `,
      params,
    );

    return rows.map((row: any) => {
      const applicants = Number(row.applicants) || 0;
      const joined = Number(row.joined) || 0;
      return {
        source: row.source,
        applicants,
        joined,
        hiringRate: this.ratio(joined, applicants),
        averageInterviewScore: this.round2(row.averageInterviewScore),
      };
    });
  }

  async getBySourceCost(filters: AnalyticsFilterDto) {
    const { sql: where, params } = this.buildWhere(filters);
    const rows = await this.dataSource.query(
      `
      SELECT
        COALESCE(s.source_name, 'Unknown') AS source,
        COUNT(DISTINCT a.application_id) AS applicants,
        COUNT(DISTINCT CASE WHEN a.joining_date IS NOT NULL THEN a.application_id END) AS joined,
        AVG(i.overall_score) AS averageInterviewScore,
        SUM(a.recruitment_cost) AS totalCost
      ${BASE_FROM}
      ${where}
      GROUP BY s.source_name
      ORDER BY applicants DESC
      `,
      params,
    );

    return rows.map((row: any) => {
      const applicants = Number(row.applicants) || 0;
      const joined = Number(row.joined) || 0;
      const totalCost = Number(row.totalCost) || 0;
      return {
        source: row.source,
        applicants,
        joined,
        hiringRate: this.ratio(joined, applicants),
        averageInterviewScore: this.round2(row.averageInterviewScore),
        totalCost: this.round2(totalCost),
        costPerHire: joined ? this.round2(totalCost / joined) : 0,
      };
    });
  }

  async getByEducation(filters: AnalyticsFilterDto) {
    const { sql: where, params } = this.buildWhere(filters);
    const rows = await this.dataSource.query(
      `
      SELECT
        COALESCE(c.education, 'Unknown') AS education,
        COUNT(DISTINCT a.application_id) AS applicants,
        COUNT(DISTINCT CASE WHEN a.joining_date IS NOT NULL THEN a.application_id END) AS joined,
        AVG(i.overall_score) AS averageInterviewScore
      ${BASE_FROM}
      ${where}
      GROUP BY c.education
      ORDER BY applicants DESC
      `,
      params,
    );

    return rows.map((row: any) => {
      const applicants = Number(row.applicants) || 0;
      const joined = Number(row.joined) || 0;
      return {
        education: row.education,
        applicants,
        joined,
        hiringRate: this.ratio(joined, applicants),
        averageInterviewScore: this.round2(row.averageInterviewScore),
      };
    });
  }

  /**
   * Experience buckets: 0-2, 3-5, 6-10, 10+ years. This bucketing is an
   * implementation assumption (not part of the schema) chosen to mirror the
   * shape of experience_effectiveness.csv.
   */
  async getByExperience(filters: AnalyticsFilterDto) {
    const { sql: where, params } = this.buildWhere(filters);
    const rows = await this.dataSource.query(
      `
      SELECT
        CASE
          WHEN c.experience_years IS NULL THEN 'Unknown'
          WHEN c.experience_years <= 2 THEN '0-2 years'
          WHEN c.experience_years <= 5 THEN '3-5 years'
          WHEN c.experience_years <= 10 THEN '6-10 years'
          ELSE '10+ years'
        END AS experienceCategory,
        COUNT(DISTINCT a.application_id) AS applicants,
        COUNT(DISTINCT CASE WHEN a.joining_date IS NOT NULL THEN a.application_id END) AS joined
      ${BASE_FROM}
      ${where}
      GROUP BY experienceCategory
      ORDER BY MIN(c.experience_years)
      `,
      params,
    );

    return rows.map((row: any) => {
      const applicants = Number(row.applicants) || 0;
      const joined = Number(row.joined) || 0;
      return {
        experienceCategory: row.experienceCategory,
        applicants,
        joined,
        hiringRate: this.ratio(joined, applicants),
      };
    });
  }

  /**
   * Match-score buckets: High (>=80), Medium (60-79), Low (<60). An
   * implementation assumption to mirror match_effectiveness.csv.
   */
  async getByMatch(filters: AnalyticsFilterDto) {
    const { sql: where, params } = this.buildWhere(filters);
    const rows = await this.dataSource.query(
      `
      SELECT
        CASE
          WHEN a.match_score IS NULL THEN 'Unknown'
          WHEN a.match_score >= 80 THEN 'High (80-100)'
          WHEN a.match_score >= 60 THEN 'Medium (60-79)'
          ELSE 'Low (<60)'
        END AS matchCategory,
        COUNT(DISTINCT a.application_id) AS applicants,
        COUNT(DISTINCT CASE WHEN a.joining_date IS NOT NULL THEN a.application_id END) AS joined
      ${BASE_FROM}
      ${where}
      GROUP BY matchCategory
      ORDER BY MIN(a.match_score) DESC
      `,
      params,
    );

    return rows.map((row: any) => {
      const applicants = Number(row.applicants) || 0;
      const joined = Number(row.joined) || 0;
      return {
        matchCategory: row.matchCategory,
        applicants,
        joined,
        hiringRate: this.ratio(joined, applicants),
      };
    });
  }

  async getByRecruiter(filters: AnalyticsFilterDto) {
    const { sql: where, params } = this.buildWhere(filters);
    const rows = await this.dataSource.query(
      `
      SELECT
        COALESCE(r.recruiter_name, 'Unassigned') AS recruiter,
        COUNT(DISTINCT a.application_id) AS candidatesSourced,
        COUNT(DISTINCT CASE WHEN a.shortlist_date IS NOT NULL THEN a.application_id END) AS shortlisted,
        COUNT(DISTINCT CASE WHEN a.interview_date IS NOT NULL THEN a.application_id END) AS interviewed,
        COUNT(DISTINCT CASE WHEN a.offer_date IS NOT NULL THEN a.application_id END) AS offers,
        COUNT(DISTINCT CASE WHEN a.joining_date IS NOT NULL THEN a.application_id END) AS joined
      ${BASE_FROM}
      ${where}
      GROUP BY r.recruiter_name
      ORDER BY candidatesSourced DESC
      `,
      params,
    );

    return rows.map((row: any) => {
      const candidatesSourced = Number(row.candidatesSourced) || 0;
      const joined = Number(row.joined) || 0;
      return {
        recruiter: row.recruiter,
        candidatesSourced,
        shortlisted: Number(row.shortlisted) || 0,
        interviewed: Number(row.interviewed) || 0,
        offers: Number(row.offers) || 0,
        joined,
        hiringRate: this.ratio(joined, candidatesSourced),
      };
    });
  }

  async getMonthlyHiring(filters: AnalyticsFilterDto) {
    // Monthly hiring counts hires by the month they actually joined, so the
    // optional date range filters the joining_date rather than the
    // application_date.
    const { sql: where, params } = this.buildWhere(filters, 'a.joining_date');
    const joinedWhere = where
      ? `${where} AND a.joining_date IS NOT NULL`
      : 'WHERE a.joining_date IS NOT NULL';

    const rows = await this.dataSource.query(
      `
      SELECT
        DATE_FORMAT(a.joining_date, '%Y-%m') AS joiningMonth,
        COUNT(DISTINCT a.application_id) AS hires
      ${BASE_FROM}
      ${joinedWhere}
      GROUP BY joiningMonth
      ORDER BY joiningMonth ASC
      `,
      params,
    );

    return rows.map((row: any) => ({
      joiningMonth: row.joiningMonth,
      hires: Number(row.hires) || 0,
    }));
  }

  async getKpis(filters: AnalyticsFilterDto) {
    const { sql: where, params } = this.buildWhere(filters);

    const row = await this.queryOne(
      `
      SELECT
        COUNT(DISTINCT a.application_id) AS totalApplicants,
        COUNT(DISTINCT CASE WHEN a.joining_date IS NOT NULL THEN a.application_id END) AS totalJoined,
        AVG(i.overall_score) AS averageInterviewScore,
        AVG(CASE WHEN a.joining_date IS NOT NULL
              THEN DATEDIFF(a.joining_date, a.application_date) END) AS averageTimeToHire,
        AVG(CASE WHEN a.joining_date IS NOT NULL AND j.job_posted_date IS NOT NULL
              THEN DATEDIFF(a.joining_date, j.job_posted_date) END) AS averageTimeToFill,
        COUNT(DISTINCT o.offer_id) AS totalOffers,
        COUNT(DISTINCT CASE WHEN o.offer_status = 'Accepted' THEN o.offer_id END) AS acceptedOffers
      ${BASE_FROM}
      ${where}
      `,
      params,
    );

    const totalApplicants = Number(row.totalApplicants) || 0;
    const totalJoined = Number(row.totalJoined) || 0;
    const totalOffers = Number(row.totalOffers) || 0;
    const acceptedOffers = Number(row.acceptedOffers) || 0;

    return {
      'Total Applicants': totalApplicants,
      'Total Joined': totalJoined,
      'Average Time to Hire': this.round2(row.averageTimeToHire),
      'Average Time to Fill': this.round2(row.averageTimeToFill),
      'Average Interview Score': this.round2(row.averageInterviewScore),
      'Offer Acceptance Rate': this.ratio(acceptedOffers, totalOffers),
      'Hiring Success Rate': this.ratio(totalJoined, totalApplicants),
    };
  }
}
