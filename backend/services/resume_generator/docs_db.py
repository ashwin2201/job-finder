from langchain_postgres.vectorstores import PGVector
from langchain_huggingface import HuggingFaceEmbeddings
import os, asyncio, psycopg_pool

POOL = psycopg_pool.AsyncConnectionPool(conninfo=os.getenv("PG_CONN")) # async functionality

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

vector_store = PGVector(
    embeddings=embeddings,
    collection_name="my_docs",
    connection="postgresql+psycopg://...",
)

