import sys
import os
import json

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "parser"))
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "nlp"))
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from pdf_parser import extract_text_from_pdf
from docx_parser import extract_text_from_docx
from profile_builder import build_candidate_profile
from matcher import calculate_match_score


def rank_candidates(resume_paths: list, job_requirement: dict) -> list:
    """
    Takes a list of resume file paths (PDF or DOCX), builds a profile
    for each, scores them against job_requirement, and returns a list
    of results sorted from highest to lowest overall_score.
    """
    results = []

    for resume_path in resume_paths:
        if resume_path.lower().endswith(".pdf"):
            resume_text = extract_text_from_pdf(resume_path)
        elif resume_path.lower().endswith(".docx"):
            resume_text = extract_text_from_docx(resume_path)
        else:
            print(f"Skipping unsupported file type: {resume_path}")
            continue

        candidate_profile = build_candidate_profile(resume_text)
        match_result = calculate_match_score(candidate_profile, job_requirement)

        results.append({
            "candidate_name": candidate_profile.get("name", "Unknown"),
            "resume_file": resume_path,
            "overall_score": match_result["overall_score"],
            "breakdown": match_result["breakdown"]
        })

    # Sort by overall_score, highest first
    results.sort(key=lambda r: r["overall_score"], reverse=True)

    return results


if __name__ == "__main__":
    with open("data/sample_job.json", "r", encoding="utf-8") as f:
        job_requirement = json.load(f)

    resume_files = [
        "resumes/sample_test_resume.pdf",
        "resumes/sample_test_resume.docx"
    ]

    ranked_results = rank_candidates(resume_files, job_requirement)

    print("----- CANDIDATE RANKING -----")
    for rank, candidate in enumerate(ranked_results, start=1):
        print(f"{rank}. {candidate['candidate_name']} — {candidate['overall_score']}%")

    print("\n----- FULL DETAILS -----")
    print(json.dumps(ranked_results, indent=2))