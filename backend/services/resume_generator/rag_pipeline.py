from langchain.schema.runnable import RunnablePassthrough, RunnableLambda
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import re
from services.resume_generator.model import llm
from services.resume_generator.docs_db import vectorstore as get_vectorstore


SYSTEM_PROMPT = (
    "あなたは日本の人事担当者です。敬語を正しく用い、"
    "履歴書・職務経歴書の正式なフォーマットで出力してください。"
)

DRAFT_TEMPLATE = PromptTemplate.from_template(
    """
【候補者情報】
{candidate_json}

【求人情報要約】
{jd_summary}

【参考フレーズ】
{retrieved}

上記を参考に、職務経歴書（日本語）を生成してください。
"""
)

CHECK_TEMPLATE = PromptTemplate.from_template(
    "以下の履歴書を点検し、誤った敬語やカジュアル表現を修正して同じ形式で返してください。\n\n{draft}"
)


def casual_flag(t): return bool(re.search(r"だ。|俺|僕|と思う", t))

def to_dict(obj) -> dict:
    if hasattr(obj, "model_dump"):
        return obj.model_dump()
    if isinstance(obj, dict):
        return obj
    # fallback: object __dict__
    return vars(obj)

def get_job_description(obj) -> str:
    if hasattr(obj, "job_description"):
        return getattr(obj, "job_description") or ""
    if isinstance(obj, dict):
        return obj.get("job_description", "") or obj.get("jd_summary", "")
    return ""

def format_candidate(obj) -> str:
    d = to_dict(obj)
    # pick relevant fields if present
    fields = [
        "first_name_kana", "last_name_kana", "dob",
        "email", "phone", "address_en", "resume_text"
    ]
    lines = []
    for f in fields:
        v = d.get(f)
        if v:
            lines.append(f"{f}: {v}")
    return "\n".join(lines) if lines else str(d)


async def build_pipeline():
    vectorstore = await get_vectorstore()
    retriever = vectorstore.as_retriever(k=5)

    rag_chain = (
        {
            "candidate_json": RunnableLambda(format_candidate),
            "jd_summary":     RunnableLambda(get_job_description),
            "retrieved":      RunnableLambda(get_job_description) | retriever | (lambda docs: "\n".join(d.page_content for d in docs)),
        }
        | DRAFT_TEMPLATE
        | llm               # Hugging Face LLM
        | StrOutputParser()
    )

    checker_chain = (
        {"draft": rag_chain}
        | CHECK_TEMPLATE
        | llm
        | StrOutputParser()
        | RunnableLambda(lambda txt: (txt, casual_flag(txt)))
    )

    return checker_chain

# Usage example:
# checker_chain = asyncio.run(build_pipeline())

