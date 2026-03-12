from fastapi import FastAPI
from app.routes import summarize

app = FastAPI()

app.include_router(summarize.router)

@app.get("/")
def root():
    return {"message": "AI Summarizer Service Running"}