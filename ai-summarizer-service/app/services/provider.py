from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

model_name = "google/flan-t5-large"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)


def chunk_text(text, chunk_size=400):
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)

    return chunks


# Detect analytical / data-heavy documents
def is_data_heavy(text):
    keywords = [
        "mean", "standard deviation", "variance",
        "correlation", "covariance", "regression",
        "forecast", "dataset", "price (inr)"
    ]

    text_lower = text.lower()
    count = sum(1 for k in keywords if k in text_lower)

    return count >= 2


def summarize_chunk(chunk, mode="text"):

    if mode == "structured":

        prompt = f"""
You are an AI legal assistant.

Convert the following structured case data into a short narrative summary.

Rules:
- Do NOT repeat field names
- Combine information naturally
- Write 2–3 sentences describing the case

Case Data:
{chunk}

Summary:
"""

    elif mode == "data":

        prompt = f"""
You are a financial analyst reading a stock analysis report.

Ignore section titles, figure labels, and raw tables.

Instead identify the key insights such as:
- Tell about the company    
- overall price trend
- important statistics (mean, range, variance)
- correlation or regression findings
- forecast direction

Explain the findings in 2–3 sentences like a report summary.

Report content:
{chunk}

Insight Summary:
"""

    else:

        prompt = f"""
Write a concise 2–3 sentence summary of the following document.

Document:
{chunk}

Summary:
"""

    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        max_length=1024,
        truncation=True
    )

    outputs = model.generate(
        inputs["input_ids"],
        max_length=120,
        min_length=40,
        num_beams=4,
        repetition_penalty=3.0,
        length_penalty=1.2,
        no_repeat_ngram_size=4,
        early_stopping=True
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)


def summarize_text(text: str, is_structured=False):

    # Determine document type
    if is_structured:
        mode = "structured"
    elif is_data_heavy(text):
        mode = "data"
    else:
        mode = "text"

    chunks = chunk_text(text)
    chunk_summaries = []

    for chunk in chunks:
        summary = summarize_chunk(chunk, mode)
        chunk_summaries.append(summary)

    combined = " ".join(chunk_summaries)

    # Final refinement step
    prompt = f"""
Combine the following partial summaries into one clear and concise summary.

Rules:
- Maximum 3 sentences
- Remove repetition
- Keep the most important insights

Summaries:
{combined}

Final Summary:
"""

    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        max_length=1024,
        truncation=True
    )

    outputs = model.generate(
        inputs["input_ids"],
        max_length=120,
        num_beams=4,
        repetition_penalty=2.5,
        no_repeat_ngram_size=3
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)