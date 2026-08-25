# AI Model — Smart Recruitment Analytics

AI/ML service for resume parsing, candidate profiling, and job-match scoring.

## Setup

```bash
cd ai-model
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Running the service

```bash
uvicorn app.main:app --reload
```

Runs at `http://127.0.0.1:8000`. Interactive docs at `http://127.0.0.1:8000/docs`.

## Endpoints

### `GET /`
Health check. Returns `{"message": "AI service is running"}`.

### `POST /parse-resume`
Accepts one resume file (PDF or DOCX) as `multipart/form-data`, field name `file`.

**Returns:**
```json
{
  "name": "Candidate Name",
  "skills": ["Python", "SQL"],
  "education": ["B.Tech Computer Science, 2023"],
  "projects": ["Project Name", "..."]
}
```

### `POST /rank-candidates`
Accepts multiple resume files (`files`, multipart) plus a `job_requirement` field (JSON string, sent as a form field).

**`job_requirement` format:**
```json
{
  "job_title": "Data Analyst Intern",
  "required_skills": ["Python", "SQL"],
  "required_experience_years": 0,
  "required_education": ["Bachelor"],
  "required_certifications": [],
  "preferred_projects_keywords": ["dashboard"]
}
```

**Returns:** array of candidates sorted by `overall_score`, highest first.
```json
[
  {
    "candidate_name": "Name",
    "resume_file": "filename.pdf",
    "overall_score": 80.0,
    "breakdown": {
      "skills_score": 100.0,
      "experience_score": 100.0,
      "education_score": 100.0,
      "certifications_score": 0.0,
      "projects_score": 0.0
    }
  }
]
```

## Running tests

```bash
pytest tests/ -v
```

## Known limitations (for future improvement)
- Experience scoring is currently a placeholder (always scores 100%) — real years-of-experience extraction not yet built
- Certifications extraction not yet built (scores 0% always)
- Skills/education matching uses keyword + synonym lists, not full NLP — may miss uncommon phrasing