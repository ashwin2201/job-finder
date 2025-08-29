# db.py
import os, psycopg_pool
from langchain_postgres.vectorstores import PGVector
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name="intfloat/multilingual-e5-large",
)
# else:
  #  from langchain_openai import OpenAIEmbeddings
  #  embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

connection_str = "postgresql://postgres:password@localhost:5432/job_finder"

async def vectorstore(collection="jp_snippets"):
    return PGVector(
        connection=connection_str,
        collection_name=collection,
        embeddings=embeddings,
    )
