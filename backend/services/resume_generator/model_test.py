
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()

repo_id = "elyza/Llama-3-ELYZA-JP-8B"

question = "日本語履歴書を生成してください"
template = """Question: {question}
Answer: よく考えましょう."""
prompt = PromptTemplate.from_template(template)

llm = HuggingFaceEndpoint(
    repo_id=repo_id,
    temperature=0.5,
    huggingfacehub_api_token=os.getenv("HF_TOKEN"),
    provider="auto",  # set your provider here hf.co/settings/inference-providers
)

# ChatHuggingFace usage
chat_model = ChatHuggingFace(llm=llm)

llm_chain = prompt | chat_model
print(llm_chain.invoke({"question": question}))