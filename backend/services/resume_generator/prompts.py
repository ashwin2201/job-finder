from langchain.prompts import PromptTemplate

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
