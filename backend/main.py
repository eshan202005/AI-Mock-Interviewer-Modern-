from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import resume
from routers import interview
from routers import evaluation
from routers import voice
from database.db import engine
from database.models import Base

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(resume.router)
app.include_router(interview.router)
app.include_router(evaluation.router)
app.include_router(voice.router)


@app.get("/")
def home():
    return {
        "message": "AI Mock Interviewer Backend Running"
    }