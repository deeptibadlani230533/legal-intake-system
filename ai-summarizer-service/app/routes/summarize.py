from fastapi import APIRouter, UploadFile, File
import pdfplumber
import pandas as pd
from app.services.provider import summarize_text

router = APIRouter()


def clean_text(text: str):
    text = text.replace("\n", " ")
    return " ".join(text.split())


def is_structured(text: str):
    keywords = [
        "case id",
        "client name",
        "incident date",
        "claim amount",
        "status"
    ]

    text_lower = text.lower()
    count = sum(1 for k in keywords if k in text_lower)

    return count >= 2


def is_data_heavy(text: str):
    keywords = [
        "mean", "standard deviation", "variance",
        "correlation", "covariance", "regression",
        "forecast", "dataset", "price"
    ]

    text_lower = text.lower()
    count = sum(1 for k in keywords if k in text_lower)

    return count >= 2


@router.post("/summarize-file")
async def summarize_file(file: UploadFile = File(...)):

    text = ""
    table_text = ""

    # Only allow PDF or TXT
    if not (file.filename.endswith(".pdf") or file.filename.endswith(".txt")):
        return {"error": "Only PDF or TXT files supported"}

    if file.filename.endswith(".pdf"):

        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:

                # Extract tables
                tables = page.extract_tables()
                if tables:
                    for table in tables:
                        try:
                            df = pd.DataFrame(table[1:], columns=table[0])
                            table_text += df.to_markdown(index=False) + "\n\n"
                        except:
                            pass

                # Extract normal text
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"

    else:
        text = (await file.read()).decode("utf-8")

    # Combine table data + text
    combined_text = text + "\n" + table_text

    processed_text = clean_text(combined_text)

    # Detect document type
    structured = is_structured(processed_text)
    data_doc = is_data_heavy(processed_text)

    # Send correct mode to AI
    summary = summarize_text(processed_text, structured)

    if data_doc:
        mode = "data"
    elif structured:
        mode = "structured"
    else:
        mode = "narrative"

    return {
        "filename": file.filename,
        "mode": mode,
        "summary": summary
    }