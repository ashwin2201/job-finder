from app.integrations.resume_generator.model import get_openai_client, model_name


client = get_openai_client()
question = "日本語の職務経歴書を丁寧な文体で改善してください。"

response = client.responses.create(
    model=model_name,
    input=f"Question: {question}\nAnswer:",
)

print(response.output_text)
