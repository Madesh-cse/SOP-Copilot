import pymupdf as fitz #type: ignore
from pathlib import Path

def  load_pdf_documents(data_dir: str):
    documents = []
    pdf_files = list(Path(data_dir).glob("*.pdf"))
    for pdf_path in pdf_files:
        pdf = fitz.open(pdf_path)
        for page_number, page in enumerate(pdf):
            text = page.get_text("text").strip()
            if not text:
                continue
            documents.append({
                "text": text,
                "metadata":{
                    "source": pdf_path.name,
                    "page": page_number + 1
                }
            })
        pdf.close()
    return documents
        