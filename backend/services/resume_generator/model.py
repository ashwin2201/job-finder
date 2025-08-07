from langchain_huggingface import HuggingFaceEndpoint

model_name = "elyza/Llama-3-ELYZA-JP-8B"

# llm: draft & checker passes
llm = HuggingFaceEndpoint(
    repo_id=model_name,
    task="text-generation",
    max_new_tokens=2048,
    do_sample=False,
    repetition_penalty=1.03,
)

