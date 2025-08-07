# ingest.py
import asyncio, pathlib, json, re
from bs4 import BeautifulSoup
from pdfminer.high_level import extract_text
from docs_db import vectorstore

DATA_DIR = pathlib.Path("raw_docs")   # put PDFs/HTML/TXT inside
SENTENCE_SPLIT = re.compile(r"(?<=。)\s*")

def load_file(fp: pathlib.Path) -> str:
    if fp.suffix.lower() == ".pdf":
        return extract_text(str(fp))
    if fp.suffix.lower() in {".html", ".htm"}:
        return BeautifulSoup(fp.read_text("utf-8"), "lxml").get_text()
    return fp.read_text("utf-8")

def normalize(txt: str) -> str:
    return txt.replace("\u3000", " ").strip()

def chunk(text: str, doc_type: str) -> list[tuple[str, dict]]:
    if doc_type == "bullet":
        sent = [s.strip() for s in SENTENCE_SPLIT.split(text) if s.strip()]
        return [(s, {"doc_type": doc_type}) for s in sent]
    # template or keigo lists → ~350 char chunks
    CHUNK_SIZE = 350
    segs = [text[i : i + CHUNK_SIZE] for i in range(0, len(text), CHUNK_SIZE)]
    return [(seg, {"doc_type": doc_type}) for seg in segs]

async def main():
    docs, metas = [], []
    for fp in DATA_DIR.rglob("*.*"):
        if fp.suffix.lower() not in {".pdf", ".html", ".htm", ".txt"}:
            continue
        if "keigo" in fp.stem:
            dtype = "keigo"
        elif "template" in fp.stem or "format" in fp.stem:
            dtype = "template"
        elif "ng_word" in fp.stem or "rule" in fp.stem:
            dtype = "rule"
        else:
            dtype = "bullet"
        raw = normalize(load_file(fp))
        for chunk_txt, meta in chunk(raw, dtype):
            docs.append(chunk_txt)
            meta["source_file"] = fp.name
            metas.append(meta)

    vs = await vectorstore()
    await vs.add_texts(texts=docs, metadatas=metas)
    print(f"Ingested {len(docs)} chunks.")

if __name__ == "__main__":
    asyncio.run(main())
