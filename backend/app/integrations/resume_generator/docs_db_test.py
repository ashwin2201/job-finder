import asyncio
from docs_db import vectorstore

async def simple_retrieval():
    vs = await vectorstore()
    query = "システム開発"
    docs = vs.similarity_search(query)
    return docs

async def get_all_docs():
    vs = await vectorstore()
    docs = vs.get_all_documents()
    return docs

docs = asyncio.run(get_all_docs())
print(docs)