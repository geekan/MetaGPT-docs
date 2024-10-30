# RAG Module

RAG (Retrieval-Augmented Generation) enhances the ability of Large Language Models (LLMs) to generate responses by referencing external authoritative knowledge bases. This method allows the LLM to access domain-specific knowledge without retraining, improving the relevance, precision, and practicality of the output.

This article focuses on the RAG functions provided by the current MetaGPT:

1. Data input, supports various file formats (including pdf/docx/md/csv/txt/ppt), Python objects.
2. Retrieval, supports Faiss/BM25/ChromaDB/ES, and mixed retrieval.
3. Post-retrieval, supports LLM Rerank/ColbertRerank/CohereRerank/BGERerank/ObjectRerank, reordering the retrieved content to get more accurate data.
4. Data update, addition of text and Python objects.
5. Data storage and recovery, vectorization is not required each time.

For more examples, please see [rag_pipeline](https://github.com/geekan/MetaGPT/blob/main/examples/rag/rag_pipeline.py) and [rag_search](https://github.com/geekan/MetaGPT/blob/main/examples/rag/rag_search.py)

## Prepare

- Installation

```shell
# from pypi
pip install metagpt[rag]
```

```shell
# from source code
pip install -e .[rag]
```

> Note：
>
> 1. Some modules are quite large and use lazy loading, requiring manual installation. For example, to use ColbertRerank, you need to install `llama-index-postprocessor-colbert-rerank`.

- Set embedding

```yaml
# openai
embedding:
  api_type: "openai"
  base_url: "YOU_BASE_URL"
  api_key: "YOU_API_KEY"
  dimensions: "YOUR_MODEL_DIMENSIONS" # output dimension of embedding model

# azure
embedding:
  api_type: "azure"
  base_url: "YOU_BASE_URL"
  api_key: "YOU_API_KEY"
  api_version: "YOU_API_VERSION"
  dimensions: "YOUR_MODEL_DIMENSIONS" # output dimension of embedding model

# gemini
embedding:
  api_type: "gemini"
  api_key: "YOU_API_KEY"
  dimensions: "YOUR_MODEL_DIMENSIONS" # output dimension of embedding model

# ollama
embedding:
  api_type: "ollama"
  base_url: "YOU_BASE_URL"
  model: "YOU_MODEL"
  dimensions: "YOUR_MODEL_DIMENSIONS" # output dimension of embedding model
```

> Note：
>
> 1. For backward compatibility, if the embedding is not set and the llm's api_type is either openai or azure, the llm's config will be used.
> 2. If llm is ollama, there might be an error message "context size was not non-negative". In this case, you need to set the max_token in llm, for example, 2048.
> 3. If you need to use other types of embeddings, such as huggingface, bedrock, etc. The [from_docs](https://github.com/geekan/MetaGPT/blob/main/metagpt/rag/engines/simple.py#L82) and [from_objs](https://github.com/geekan/MetaGPT/blob/main/metagpt/rag/engines/simple.py#L123) functions provide the field `embed_model`, which can accept different embeddings, including [the embeddings supported by Llama Index](https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/embeddings) and [the custom embeddings supported by Llama Index](https://docs.llamaindex.ai/en/stable/examples/embeddings/custom_embeddings/).

- Set omniparse

```yaml
omniparse:
  api_key: 'YOUR_API_KEY'
  base_url: 'YOUR_BASE_URL'
```

> Note：
>
> 1. `omniparse` is an optional configuration, the purpose is to optimize the parsing effect of `pdf`.
> 2. If `omniparse` is configured, only `pdf` files are parsed using `omniparse`, and other files still use the built-in parser of `Llama Index`.

## 1. Data input

### Example 1.1: files or directory

```python
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

```python
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

In this example, with the simplest configuration, we define the Player object, wherein the most important is that the custom object must meet the interface (for details, refer to [RAGObject](https://github.com/geekan/MetaGPT/blob/main/metagpt/rag/interface.py)).

## 2. Retrieval

### Example 2.1: faiss

```python
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

```python
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

```python
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

> Note:
>
> 1. Because use LLM Reranker, if the answer from the LLM is incorrect, may encounter `IndexError: list index out of range`.

## 4. Data update

### Example 4.1: Adding text and Python objects

```python
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

```python
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

> Note:
>
> 1. Using Post-retrieval can obtain better result, if use LLM Reranker, due to the uncertainty of the capabilities of LLM, it is not always guaranteed that the output will be parseable for reranking, prefer `gpt-4-turbo`, otherwise might encounter `IndexError: list index out of range` or `ValueError: invalid literal for int() with base 10`.

In this example, we first save the vectorized data in persist_dir, then query after restoring from persist_dir.
