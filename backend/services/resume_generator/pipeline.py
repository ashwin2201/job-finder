from langchain.schema.runnable import RunnablePassthrough, RunnableLambda
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import re
from services.resume_generator.model import llm
from services.resume_generator.docs_db import get_vectorstore


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


async def build_pipeline():
    vectorstore = await get_vectorstore()
    retriever   = vectorstore.as_retriever(k=5)

    rag_chain = (
        {
            "candidate_json": RunnablePassthrough(),
            "jd_summary":      lambda x: x["jd_summary"],
            "retrieved":       retriever | (lambda docs: "\n".join(d.page_content for d in docs)),
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

