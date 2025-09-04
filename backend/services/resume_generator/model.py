import os
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from dotenv import load_dotenv

load_dotenv()

model_name = "elyza/Llama-3-ELYZA-JP-8B"

# llm: draft & checker passes
llm = HuggingFaceEndpoint(
    repo_id=model_name,
    max_new_tokens=2048,
    do_sample=False,
    repetition_penalty=1.03,
    huggingfacehub_api_token=os.getenv("HF_TOKEN"),
    provider="auto"
)

chat_model = ChatHuggingFace(llm=llm)
     
