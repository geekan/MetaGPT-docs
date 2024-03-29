# RAG Module
RAG (Retrieval-Augmented Generation) enhances the ability of Large Language Models (LLMs) to generate responses by referencing external authoritative knowledge bases. This method allows the LLM to access domain-specific knowledge without retraining, improving the relevance, precision, and practicality of the output.

This article focuses on the RAG functions provided by the current MetaGPT:
1. Data input, supports various file formats (including pdf/docx/md/csv/txt/ppt), Python objects.
2. Retrieval, supports Faiss/BM25/ChromaDB/ES, and mixed retrieval.
3. Post-retrieval, supports LLM Rerank/ColbertRerank, reordering the retrieved content to get more accurate data.
4. Data update, addition of text and Python objects.
5. Data storage and recovery, vectorization is not required each time.

## Prepare
- Installation
```
# from pypi
pip install metagpt[rag]
```
```
# from source code
pip install -e .[rag]
```

- Note
```
1. Some modules are quite large and use lazy loading, requiring manual installation. For example, to use ColbertRerank, you need to install `llama-index-postprocessor-colbert-rerank`
```

## 1. Data input
### Example 1.1: files or directory
```
import asyncio

from metagpt.rag.engines import SimpleEngine
from metagpt.const import EXAMPLE_DATA_PATH

DOC_PATH = EXAMPLE_DATA_PATH / "rag/travel.txt"

async def main():
    engine = SimpleEngine.from_docs(input_files=[DOC_PATH])
    answer = await engine.aquery("What does Bob like?")
    print(answer)

if __name__ == "__main__":
    asyncio.run(main())

```
In this example, we use the simplest configuration, input a file, receive a question, and print out the search results.

### Example 1.2: Python objects
```
import asyncio

from pydantic import BaseModel

from metagpt.rag.engines import SimpleEngine


class Player(BaseModel):
    name: str
    goal: str

    def rag_key(self):
        return f"{self.name}'s goal is {self.goal}."


async def main():
    objs = [Player(name="Jeff", goal="Top One"), Player(name="Mike", goal="Top Three")]
    engine = SimpleEngine.from_objs(objs=objs)
    answer = await engine.aquery("What is Jeff's goal?")
    print(answer)

if __name__ == "__main__":
    asyncio.run(main())
```
In this example, with the simplest configuration, we define the Player object, wherein the most important is that the custom object must meet the interface (for details, refer to [RAGObject](https://github.com/geekan/MetaGPT/blob/main/metagpt/rag/interface.py)), input a file, receive a question, and then print out the query results.

## 2. Retrieval
### Example 2.1: faiss
```
import asyncio

from metagpt.rag.engines import SimpleEngine
from metagpt.rag.schema import FAISSRetrieverConfig
from metagpt.const import EXAMPLE_DATA_PATH

DOC_PATH = EXAMPLE_DATA_PATH / "rag/travel.txt"


async def main():
    engine = SimpleEngine.from_docs(input_files=[DOC_PATH], retriever_configs=[FAISSRetrieverConfig()])
    answer = await engine.aquery("What does Bob like?")
    print(answer)

if __name__ == "__main__":
    asyncio.run(main())
```
In this example, we use faiss for retrieval, where more parameters can be viewed in FAISSRetrieverConfig.
### Example 2.2: faiss and bm25 hybrid retrieval
```
import asyncio

from metagpt.rag.engines import SimpleEngine
from metagpt.rag.schema import FAISSRetrieverConfig, BM25RetrieverConfig
from metagpt.const import EXAMPLE_DATA_PATH

DOC_PATH = EXAMPLE_DATA_PATH / "rag/travel.txt"


async def main():
    engine = SimpleEngine.from_docs(input_files=[DOC_PATH], retriever_configs=[FAISSRetrieverConfig(), BM25RetrieverConfig()])
    answer = await engine.aquery("What does Bob like?")
    print(answer)

if __name__ == "__main__":
    asyncio.run(main())
```
In this example, we use faiss and bm25 for mixed retrieval, combining the results from both retrievals after deduplication.
## 3. Post-retrieval
### Example 3.1: LLM re-ranking
```
import asyncio

from metagpt.rag.engines import SimpleEngine
from metagpt.rag.schema import FAISSRetrieverConfig, LLMRankerConfig
from metagpt.const import EXAMPLE_DATA_PATH

DOC_PATH = EXAMPLE_DATA_PATH / "rag/travel.txt"


async def main():
    engine = SimpleEngine.from_docs(input_files=[DOC_PATH], retriever_configs=[FAISSRetrieverConfig()], ranker_configs=[LLMRankerConfig()])
    answer = await engine.aquery("What does Bob like?")
    print(answer)

if __name__ == "__main__":
    asyncio.run(main())
```
In this example, we first use faiss for retrieval, then apply LLMRanker to re-rank the retrieved results, and obtain the final search outcome. 
## 4. Data update
### Example 4.1: Adding text and Python objects
```
import asyncio

from pydantic import BaseModel
from metagpt.rag.engines import SimpleEngine
from metagpt.rag.schema import FAISSRetrieverConfig
from metagpt.const import EXAMPLE_DATA_PATH

DOC_PATH = EXAMPLE_DATA_PATH / "rag/travel.txt"


class Player(BaseModel):
    name: str
    goal: str

    def rag_key(self):
        return f"{self.name}'s goal is {self.goal}"


async def main():
    engine = SimpleEngine.from_objs(retriever_configs=[FAISSRetrieverConfig()])

    engine.add_docs([DOC_PATH])
    answer = await engine.aquery("What does Bob like?")
    print(answer)

    engine.add_objs([Player(name="Jeff", goal="Top One")])
    answer = await engine.aquery("What is Jeff's goal?")
    print(answer)


if __name__ == "__main__":
    asyncio.run(main())
```

In this example, after creating an engine, we can add documents or objects. Most importantly, if a custom retriever is needed, one must implement the interface [ModifiableRAGRetriever](https://github.com/geekan/MetaGPT/blob/main/metagpt/rag/retrievers/base.py).
## 5. Data storage and recovery
### Example 5.1
```
import asyncio

from metagpt.rag.engines import SimpleEngine
from metagpt.rag.schema import FAISSRetrieverConfig, FAISSIndexConfig
from metagpt.const import EXAMPLE_DATA_PATH

DOC_PATH = EXAMPLE_DATA_PATH / "rag/travel.txt"


async def main():
    persist_dir = "./tmp_storage"
    retriever_configs = [FAISSRetrieverConfig()]
    
    # 1. save index
    SimpleEngine.from_docs(input_files=[DOC_PATH], retriever_configs=retriever_configs).persist(persist_dir)

    # 2. load index
    engine = SimpleEngine.from_index(index_config=FAISSIndexConfig(persist_path=persist_dir), retriever_configs=retriever_configs)
    
    # 3. query
    answer = await engine.aquery("What does Bob like?")
    print(answer)

if __name__ == "__main__":
    asyncio.run(main())
```
In this example, we first save the vectorized data in persist_dir, then query after restoring from persist_dir.