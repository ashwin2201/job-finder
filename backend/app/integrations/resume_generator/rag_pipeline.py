from langchain_core.prompts import PromptTemplate
import re
from app.integrations.resume_generator.model import get_openai_client, model_name
from app.integrations.resume_generator.docs_db import vectorstore as get_vectorstore


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


def call_openai(prompt: str) -> str:
    client = get_openai_client()
    response = client.responses.create(
        model=model_name,
        instructions=SYSTEM_PROMPT,
        input=prompt,
    )
    return response.output_text.strip()


class ResumeGenerationPipeline:
    def __init__(self, retriever):
        self.retriever = retriever

    def invoke(self, payload: dict) -> tuple[str, bool]:
        retrieved_docs = self.retriever.invoke(get_job_description(payload))
        retrieved_text = "\n".join(doc.page_content for doc in retrieved_docs)

        draft_prompt = DRAFT_TEMPLATE.format(
            candidate_json=format_candidate(payload),
            jd_summary=get_job_description(payload),
            retrieved=retrieved_text,
        )
        draft = call_openai(draft_prompt)

        check_prompt = CHECK_TEMPLATE.format(draft=draft)
        checked_text = call_openai(check_prompt)
        return checked_text, casual_flag(checked_text)


async def build_pipeline():
    vectorstore = await get_vectorstore()
    retriever = vectorstore.as_retriever(k=5)
    return ResumeGenerationPipeline(retriever)

# Usage example:
# checker_chain = asyncio.run(build_pipeline())

