from langchain_huggingface import HuggingFaceEndpoint

model_name = "openai/gpt-oss-20b"

# llm: draft & checker passes
llm = HuggingFaceEndpoint(
    repo_id=model_name,
    task="text-generation",
    max_new_tokens=2048,
    do_sample=False,
    repetition_penalty=1.03,
)

