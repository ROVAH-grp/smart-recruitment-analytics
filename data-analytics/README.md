# 📊 Data Analytics Module
## Smart Recruitment Analytics Platform

This module is responsible for the data cleaning, validation, analysis, KPI calculation, and business insights of the Smart Recruitment Analytics Platform.

The outputs generated in this module are used by the Power BI dashboard and can also support the Data Science and Software Development modules.

---

# 🎯 Objectives

The main objectives of this module are:

- Clean and prepare recruitment data
- Validate the quality of recruitment data
- Calculate important recruitment KPIs
- Analyze the recruitment funnel
- Analyze recruitment sources
- Analyze department performance
- Analyze recruiter performance
- Analyze recruitment costs
- Analyze monthly hiring trends
- Analyze candidate match scores
- Analyze candidate experience
- Analyze educational background
- Prepare Power BI-ready datasets
- Generate business insights for HR and management

---

# 🔄 Analytics Workflow

```text
Raw Recruitment Data
        ↓
Data Cleaning
        ↓
Data Validation
        ↓
KPI Calculation
        ↓
Recruitment Funnel Analysis
        ↓
Source / Department / Recruiter Analysis
        ↓
Recruitment Cost Analysis
        ↓
Candidate Quality Analysis
        ↓
Power BI Dashboard

🛠️ Tools & Technologies
Python
Pandas
NumPy
Jupyter Notebook
SQL
Power BI
Git & GitHub

📁 Project Structure
data-analytics/
│
├── README.md
│
├── datasets/
│   ├── recruitment_data.csv
│   ├── recruitment_funnel.csv
│   ├── recruitment_kpis.csv
│   ├── source_analytics.csv
│   ├── source_cost_analytics.csv
│   ├── department_analytics.csv
│   ├── department_cost_analytics.csv
│   ├── recruiter_analytics.csv
│   ├── monthly_hiring.csv
│   ├── match_effectiveness.csv
│   ├── experience_effectiveness.csv
│   └── education_analytics.csv
│
├── notebooks/
│   └── recruitment_analysis.ipynb
│
└── sql/
    └── recruitment_kpis.sql

    📌 Main Dataset
recruitment_data.csv

This is the main recruitment dataset used for analysis.

It contains information about:

Candidates
Jobs
Recruitment sources
Recruiters
Recruitment stages
Interview performance
Candidate experience
Education
Offers
Joining status
Recruitment cost
Time to hire
Time to fill
Main Columns
candidate_id
candidate_name
job_id
job_title
department
source
recruiter
job_posted_date
application_date
screening_date
shortlist_date
interview_date
selection_date
offer_date
joining_date
status
match_score
technical_score
communication_score
problem_solving_score
experience_years
education
offer_status
joining_status
recruitment_cost
time_to_hire
time_to_fill
overall_interview_score
joining_month
🧹 Data Cleaning & Validation

The recruitment dataset was checked and prepared before performing analytics.

The cleaning and validation process includes:

Checking missing values
Checking duplicate records
Checking data types
Converting date columns to proper datetime format
Checking numerical columns
Checking categorical values
Checking invalid dates
Checking negative values
Checking recruitment-stage logic
Checking interview score ranges
Checking recruitment cost values

The cleaned data is then used for further analysis.

📊 Analytics Performed
1. Recruitment Funnel Analysis

The recruitment funnel tracks candidate movement through different hiring stages.

Applied
   ↓
Screened
   ↓
Shortlisted
   ↓
Interviewed
   ↓
Selected
   ↓
Offered
   ↓
Joined
Dataset
recruitment_funnel.csv
Metrics
Applied Candidates
Screened Candidates
Shortlisted Candidates
Interviewed Candidates
Selected Candidates
Offers
Joined Candidates
Power BI Visual

Recommended visual:

Funnel Chart

2. Recruitment KPI Analysis

The main recruitment KPIs calculated are:

Total Applicants
Total Joined
Average Time to Hire
Average Time to Fill
Average Interview Score
Offer Acceptance Rate
Hiring Success Rate
Cost Per Hire
Dataset
recruitment_kpis.csv

These KPIs can be displayed using Power BI Cards.

3. Source Analytics

Recruitment performance is analyzed according to candidate source.

Sources include:

LinkedIn
Naukri
Indeed
Referral
Career Website
Campus Hiring
Metrics
Applicants
Joined
Hiring Rate
Average Interview Score
Dataset
source_analytics.csv
Recommended Power BI Visual

Bar Chart

Example:

Source → Hiring Rate
4. Source Cost Analytics

Recruitment cost efficiency is analyzed for each recruitment source.

Metrics
Applicants
Joined
Hiring Rate
Average Interview Score
Total Cost
Cost Per Hire
Dataset
source_cost_analytics.csv
Business Purpose

This helps HR management identify which recruitment channels provide better hiring results at lower cost.

5. Department Analytics

Recruitment performance is analyzed across different departments.

Departments include:

IT
AI & ML
Business
Software Development
Data & Analytics
Metrics
Applicants
Joined
Hiring Rate
Average Interview Score
Dataset
department_analytics.csv
6. Department Cost Analytics

Recruitment costs are analyzed across departments.

Metrics
Applicants
Joined
Hiring Rate
Average Interview Score
Total Cost
Cost Per Hire
Dataset
department_cost_analytics.csv
Business Purpose

This helps management identify departments with:

High recruitment costs
Low hiring rates
High cost per hire
Better recruitment efficiency
7. Recruiter Performance Analytics

Recruiter productivity is analyzed using recruitment-stage metrics.

Metrics
Candidates Sourced
Candidates Shortlisted
Candidates Interviewed
Offers Released
Candidates Joined
Hiring Rate
Dataset
recruiter_analytics.csv
Recommended Power BI Visual

Column / Bar Chart

This allows management to compare recruiter performance.

8. Monthly Hiring Trend

Monthly hiring trends are calculated using the candidate joining date.

Metrics
Joining Month
Number of Hires
Dataset
monthly_hiring.csv
Recommended Power BI Visual

Line Chart

This can show how hiring volume changes over time.

9. Recruitment Cost Analysis

Recruitment costs are analyzed to determine the financial efficiency of the hiring process.

Main Metrics
Total Recruitment Cost
Average Recruitment Cost per Candidate
Cost Per Hire
Formula
Cost Per Hire =
Total Recruitment Cost / Total Joined Candidates
Current Dataset Results
Total Recruitment Cost = ₹86,67,100


Average Recruitment Cost per Candidate = ₹8,667.10


Cost Per Hire = ₹84,971.57
10. Candidate Match Effectiveness

Candidates are grouped according to their match score.

Match Categories
Low        → 0–59
Average    → 60–74
Good       → 75–89
Excellent  → 90–100
Metrics
Applicants
Joined
Hiring Rate
Dataset
match_effectiveness.csv
Purpose

This analysis helps determine whether a higher candidate-job match score is associated with better hiring outcomes.

11. Experience-wise Hiring Analysis

Candidates are grouped according to their years of experience.

Experience Categories
0-1 Years
2-3 Years
4-5 Years
6-10 Years
10+ Years
Metrics
Applicants
Joined
Hiring Rate
Dataset
experience_effectiveness.csv
Purpose

This helps identify the relationship between candidate experience and hiring outcomes.

12. Education-wise Hiring Analysis

Candidate hiring outcomes are analyzed according to educational background.

Education Categories
B.E.
B.Tech
MCA
M.Tech
B.Sc
MBA
Metrics
Applicants
Joined
Hiring Rate
Average Interview Score
Dataset
education_analytics.csv
📐 Recruitment KPI Formulas
Time to Hire
Time to Hire =
Joining Date - Application Date
Time to Fill
Time to Fill =
Joining Date - Job Posted Date
Hiring Rate
Hiring Rate =
Joined Candidates / Total Applicants × 100
Offer Acceptance Rate
Offer Acceptance Rate =
Accepted Offers / Total Offers × 100
Hiring Success Rate
Hiring Success Rate =
Joined Candidates / Selected Candidates × 100
Cost Per Hire
Cost Per Hire =
Total Recruitment Cost / Total Joined Candidates
📁 Analytics Dataset Reference
Dataset	Purpose
recruitment_data.csv	Main recruitment dataset
recruitment_funnel.csv	Recruitment stage analysis
recruitment_kpis.csv	Main recruitment KPIs
source_analytics.csv	Source-wise hiring analysis
source_cost_analytics.csv	Source-wise cost analysis
department_analytics.csv	Department-wise hiring analysis
department_cost_analytics.csv	Department-wise cost analysis
recruiter_analytics.csv	Recruiter performance
monthly_hiring.csv	Monthly hiring trends
match_effectiveness.csv	Match score effectiveness
experience_effectiveness.csv	Experience-wise hiring
education_analytics.csv	Education-wise hiring
📊 Power BI Dashboard Handoff

The following datasets are prepared for the Power BI dashboard.

Dashboard Requirement	Dataset
KPI Cards	recruitment_kpis.csv
Recruitment Funnel	recruitment_funnel.csv
Source-wise Hiring	source_analytics.csv
Source Cost Analysis	source_cost_analytics.csv
Department Hiring	department_analytics.csv
Department Cost Analysis	department_cost_analytics.csv
Recruiter Performance	recruiter_analytics.csv
Monthly Hiring Trend	monthly_hiring.csv
Match Effectiveness	match_effectiveness.csv
Experience Analysis	experience_effectiveness.csv
Education Analysis	education_analytics.csv
🎨 Recommended Power BI Dashboard

The Power BI dashboard can contain the following sections:

KPI Cards
Total Applicants
Total Joined
Average Time to Hire
Average Time to Fill
Average Interview Score
Cost Per Hire
Offer Acceptance Rate
Hiring Success Rate
Charts
Recruitment Funnel
Source-wise Hiring
Monthly Hiring Trend
Recruiter Performance
Department-wise Hiring
Source-wise Cost Per Hire
Department-wise Cost Per Hire
Match Score Effectiveness
Experience-wise Hiring
Education-wise Hiring
💡 Key Business Insights

Based on the current dataset:

Recruitment Cost
Total Recruitment Cost = ₹86,67,100
Average Cost per Candidate = ₹8,667.10
Cost Per Hire = ₹84,971.57
Best Recruitment Source

Career Website currently shows the best cost efficiency among the analyzed sources.

Hiring Rate = 12.96%
Cost Per Hire = ₹67,693.95
Department Efficiency

IT has the lowest cost per hire among the analyzed departments.

Cost Per Hire = ₹73,352.47
Hiring Rate = 11.72%
Match Score

The current dataset does not show a simple linear relationship between higher match score and hiring rate.

This indicates that hiring outcomes may depend on multiple factors such as:

Interview performance
Experience
Communication
Problem solving
Education
Candidate-job match
⚠️ Current Data Limitation

The current recruitment dataset does not contain detailed:

Resume text
Candidate skills
Required job skills
Resume parsing information
Voice interview data

Therefore, detailed skill distribution and resume-parsing analytics are not included in the current Data Analytics module.

These features can be integrated later with the Data Science and Software Development modules.

🔗 Integration With Other Project Modules

The complete project consists of three major technical areas.

                    SMART RECRUITMENT
                          PLATFORM
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ↓                  ↓                  ↓
     DATA SCIENCE      DATA ANALYTICS    SOFTWARE DEVELOPMENT
          │                  │                  │
          │                  │                  │
      AI / ML Models     KPIs & Insights     Backend
      Resume Parsing     Data Analysis        Database
      Candidate Match    Power BI             APIs
      Prediction         Reports              Frontend
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ↓
                  FINAL INTEGRATED PLATFORM
Data Science

Responsible for:

Resume parsing
NLP
Candidate matching
Predictive models
Candidate selection prediction
Offer acceptance prediction
Joining probability prediction
Data Analytics

Responsible for:

Data cleaning
Data validation
KPI calculation
Recruitment analytics
Business insights
Power BI dashboard
Software Development

Responsible for:

Frontend
Backend
Database
APIs
Authentication
Integration of AI and analytics modules
🚀 Future Enhancements

Future versions can include:

AI-powered resume parsing
Automated candidate screening
Skill extraction
Job-candidate skill matching
Predictive hiring models
Offer acceptance prediction
Candidate joining prediction
Automated interview scoring
Real-time recruitment dashboards
Cloud deployment
Role-based HR authentication
👥 Team Workflow

The project uses GitHub branches for parallel development.

main
  │
  └── develop
        │
        ├── feature/ai-model
        ├── feature/frontend-backend
        ├── feature/powerbi-dashboard
        ├── feature/recruitment-analytics
        └── feature/resume-parser

Each team member works on their respective feature branch.

Completed features are reviewed and merged into develop.

After integration and testing, the stable version is merged into main.

✅ Status
Data Analytics Module
 Data collection
 Data cleaning
 Data validation
 Recruitment funnel analysis
 Recruitment KPI analysis
 Source analytics
 Department analytics
 Recruiter analytics
 Monthly hiring analysis
 Recruitment cost analysis
 Match effectiveness analysis
 Experience analysis
 Education analysis
 Power BI-ready datasets
 SQL KPI queries
 Analysis notebook
📌 Note

This module is part of the Smart Recruitment Analytics Platform group project and is designed to provide the analytical foundation for recruitment decision-making and business intelligence.



### After pasting


Save with **Ctrl + S**.


Then we'll do just these commands:


```bash
git add data-analytics/README.md
git commit -m "Add data analytics documentation"
git push origin feature/recruitment-analytics