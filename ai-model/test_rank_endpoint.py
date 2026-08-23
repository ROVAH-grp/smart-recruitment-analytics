import requests

url = "http://127.0.0.1:8000/rank-candidates"

files = [
    ("files", ("sample_test_resume.pdf", open("resumes/sample_test_resume.pdf", "rb"), "application/pdf")),
    ("files", ("sample_test_resume.docx", open("resumes/sample_test_resume.docx", "rb"), "application/vnd.openxmlformats-officedocument.wordprocessingml.document")),
]

job_requirement = '{"job_title": "Data Analyst Intern", "required_skills": ["Python", "SQL", "Power BI", "Excel"], "required_experience_years": 0, "required_education": ["Diploma", "Bachelor"], "required_certifications": [], "preferred_projects_keywords": ["dashboard", "data analysis"]}'

response = requests.post(
    url,
    files=files,
    data={"job_requirement": job_requirement}
)

print("Status code:", response.status_code)
print(response.json())