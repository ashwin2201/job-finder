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

async def vectorstore(collection="jp_snippets"):
    return PGVector(
        connection=os.getenv("PG_CONN"),
        collection_name=collection,
        embeddings=embeddings,
    )
