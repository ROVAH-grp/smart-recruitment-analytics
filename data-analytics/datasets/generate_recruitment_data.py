import pandas as pd
import numpy as np
import random
from datetime import timedelta

# Reproducibility
np.random.seed(42)
random.seed(42)

# Number of candidates
NUM_CANDIDATES = 1000

# -----------------------------
# Master data
# -----------------------------

jobs = [
    ("J001", "Data Analyst", "Data & Analytics"),
    ("J002", "Data Scientist", "AI & ML"),
    ("J003", "Software Developer", "Software Development"),
    ("J004", "Python Developer", "Software Development"),
    ("J005", "Java Developer", "Software Development"),
    ("J006", "ML Engineer", "AI & ML"),
    ("J007", "Business Analyst", "Business"),
    ("J008", "Web Developer", "IT"),
]

sources = [
    "LinkedIn",
    "Naukri",
    "Indeed",
    "Referral",
    "Career Website",
    "Campus Hiring"
]

recruiters = [
    "Priya",
    "Rahul",
    "Sneha",
    "Amit",
    "Neha"
]

educations = [
    "B.Tech",
    "B.E.",
    "B.Sc",
    "M.Tech",
    "MCA",
    "MBA"
]

first_names = [
    "Rahul", "Sneha", "Amit", "Priya", "Neha",
    "Rohan", "Karan", "Pooja", "Ananya", "Vikram",
    "Aditya", "Shreya", "Akash", "Isha", "Arjun"
]

last_names = [
    "Sharma", "Patil", "Deshmukh", "Kulkarni",
    "Joshi", "Mehta", "Verma", "Singh",
    "Pawar", "Jadhav"
]

# -----------------------------
# Helper function
# -----------------------------

def random_date(start, end):
    days = (end - start).days
    return start + timedelta(days=random.randint(0, days))


# -----------------------------
# Generate records
# -----------------------------

records = []

start_date = pd.Timestamp("2026-01-01")
end_date = pd.Timestamp("2026-08-15")

for i in range(1, NUM_CANDIDATES + 1):

    job_id, job_title, department = random.choice(jobs)

    candidate_name = (
        random.choice(first_names)
        + " "
        + random.choice(last_names)
    )

    application_date = random_date(start_date, end_date)

    # Job posted before application
    job_posted_date = application_date - timedelta(
        days=random.randint(1, 30)
    )

    source = random.choice(sources)
    recruiter = random.choice(recruiters)
    education = random.choice(educations)

    experience_years = round(
        np.random.uniform(0, 8), 1
    )

    # AI matching score
    match_score = int(
        np.clip(
            np.random.normal(75, 15),
            40,
            99
        )
    )

    # Interview scores
    technical_score = int(
        np.clip(
            np.random.normal(match_score, 10),
            40,
            100
        )
    )

    communication_score = int(
        np.clip(
            np.random.normal(78, 12),
            40,
            100
        )
    )

    problem_solving_score = int(
        np.clip(
            np.random.normal(match_score, 10),
            40,
            100
        )
    )

    # Determine recruitment stage
    stage_probability = random.random()

    if stage_probability < 0.18:
        status = "Applied"

    elif stage_probability < 0.33:
        status = "Screened"

    elif stage_probability < 0.48:
        status = "Shortlisted"

    elif stage_probability < 0.65:
        status = "Interviewed"

    elif stage_probability < 0.78:
        status = "Selected"

    elif stage_probability < 0.88:
        status = "Offered"

    else:
        status = "Joined"

    # -----------------------------
    # Recruitment dates
    # -----------------------------

    screening_date = None
    shortlist_date = None
    interview_date = None
    selection_date = None
    offer_date = None
    joining_date = None

    current_date = application_date

    if status in [
        "Screened",
        "Shortlisted",
        "Interviewed",
        "Selected",
        "Offered",
        "Joined"
    ]:
        screening_date = current_date + timedelta(
            days=random.randint(1, 5)
        )
        current_date = screening_date

    if status in [
        "Shortlisted",
        "Interviewed",
        "Selected",
        "Offered",
        "Joined"
    ]:
        shortlist_date = current_date + timedelta(
            days=random.randint(1, 5)
        )
        current_date = shortlist_date

    if status in [
        "Interviewed",
        "Selected",
        "Offered",
        "Joined"
    ]:
        interview_date = current_date + timedelta(
            days=random.randint(2, 7)
        )
        current_date = interview_date

    if status in [
        "Selected",
        "Offered",
        "Joined"
    ]:
        selection_date = current_date + timedelta(
            days=random.randint(1, 5)
        )
        current_date = selection_date

    if status in [
        "Offered",
        "Joined"
    ]:
        offer_date = current_date + timedelta(
            days=random.randint(1, 4)
        )
        current_date = offer_date

    if status == "Joined":
        joining_date = current_date + timedelta(
            days=random.randint(5, 20)
        )

    # -----------------------------
    # Offer / joining status
    # -----------------------------

    if status in ["Offered", "Joined"]:
        offer_status = (
            "Accepted"
            if status == "Joined" or random.random() < 0.8
            else "Rejected"
        )
    else:
        offer_status = "Not Applicable"

    if status == "Joined":
        joining_status = "Joined"
    elif status == "Offered" and offer_status == "Accepted":
        joining_status = "Pending"
    else:
        joining_status = "Not Applicable"

    # Recruitment cost
    recruitment_cost = random.randint(2000, 15000)

    records.append({
        "candidate_id": f"C{i:04d}",
        "candidate_name": candidate_name,
        "job_id": job_id,
        "job_title": job_title,
        "department": department,
        "source": source,
        "recruiter": recruiter,
        "job_posted_date": job_posted_date,
        "application_date": application_date,
        "screening_date": screening_date,
        "shortlist_date": shortlist_date,
        "interview_date": interview_date,
        "selection_date": selection_date,
        "offer_date": offer_date,
        "joining_date": joining_date,
        "status": status,
        "match_score": match_score,
        "technical_score": technical_score,
        "communication_score": communication_score,
        "problem_solving_score": problem_solving_score,
        "experience_years": experience_years,
        "education": education,
        "offer_status": offer_status,
        "joining_status": joining_status,
        "recruitment_cost": recruitment_cost
    })


# -----------------------------
# Create DataFrame
# -----------------------------

df = pd.DataFrame(records)

# Format dates
date_columns = [
    "job_posted_date",
    "application_date",
    "screening_date",
    "shortlist_date",
    "interview_date",
    "selection_date",
    "offer_date",
    "joining_date"
]

for column in date_columns:
    df[column] = pd.to_datetime(
        df[column]
    ).dt.strftime("%Y-%m-%d")


# -----------------------------
# Save dataset
# -----------------------------

output_file = "recruitment_data.csv"

df.to_csv(
    output_file,
    index=False
)

print("Dataset created successfully!")
print(f"Rows: {len(df)}")
print(f"Columns: {len(df.columns)}")
print(f"Saved as: {output_file}")

print("\nStatus distribution:")
print(df["status"].value_counts())