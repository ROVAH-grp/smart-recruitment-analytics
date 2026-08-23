from fastapi import FastAPI

app = FastAPI(title="Smart Recruitment Analytics - AI Service")


@app.get("/")
def read_root():
    return {"message": "AI service is running"}