import sys
import os
import shutil
import tempfile
import json
from typing import List

sys.path.append(os.path.dirname(__file__))
sys.path.append(os.path.join(os.path.dirname(__file__), "parser"))
sys.path.append(os.path.join(os.path.dirname(__file__), "nlp"))
sys.path.append(os.path.join(os.path.dirname(__file__), "matching"))

from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from pdf_parser import extract_text_from_pdf
from docx_parser import extract_text_from_docx
from profile_builder import build_candidate_profile
from matcher import calculate_match_score

app = FastAPI(title="Smart Recruitment Analytics - AI Service")


@app.get("/")
def read_root():
    return {"message": "AI service is running"}


@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    filename = file.filename.lower()

    if not (filename.endswith(".pdf") or filename.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    suffix = ".pdf" if filename.endswith(".pdf") else ".docx"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
        shutil.copyfileobj(file.file, tmp_file)
        tmp_path = tmp_file.name

    try:
        if suffix == ".pdf":
            resume_text = extract_text_from_pdf(tmp_path)
        else:
            resume_text = extract_text_from_docx(tmp_path)

        candidate_profile = build_candidate_profile(resume_text)
        return candidate_profile
    finally:
        os.remove(tmp_path)


@app.post("/rank-candidates")
async def rank_candidates_endpoint(
    files: List[UploadFile] = File(...),
    job_requirement: str = Form(...)
):
    """
    Accepts multiple resume files plus a job_requirement JSON string
    (as a form field), scores each candidate, and returns them ranked
    from highest to lowest match score.
    """
    try:
        job_requirement_dict = json.loads(job_requirement)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="job_requirement must be valid JSON")

    results = []

    for file in files:
        filename = file.filename.lower()
        if not (filename.endswith(".pdf") or filename.endswith(".docx")):
            continue  # skip unsupported files silently

        suffix = ".pdf" if filename.endswith(".pdf") else ".docx"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_path = tmp_file.name

        try:
            if suffix == ".pdf":
                resume_text = extract_text_from_pdf(tmp_path)
            else:
                resume_text = extract_text_from_docx(tmp_path)

            candidate_profile = build_candidate_profile(resume_text)
            match_result = calculate_match_score(candidate_profile, job_requirement_dict)

            results.append({
                "candidate_name": candidate_profile.get("name", "Unknown"),
                "resume_file": file.filename,
                "overall_score": match_result["overall_score"],
                "breakdown": match_result["breakdown"]
            })
        finally:
            os.remove(tmp_path)

    results.sort(key=lambda r: r["overall_score"], reverse=True)
    return results