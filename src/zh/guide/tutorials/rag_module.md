# RAG 模块
RAG（Retrieval-Augmented Generation）通过引用外部权威知识库来优化大型语言模型（LLM）的输出，增强其生成响应的能力。这种方法允许LLM在不重新训练的情况下，访问特定领域的知识，提高输出的相关性、准确性和实用性。

本文主要介绍当前MetaGPT所提供的RAG功能：
1. 数据输入，支持多种格式文件（包括pdf/docx/md/csv/txt/ppt）、python对象
2. 检索功能，支持faiss/bm25/chromadb/es，并支持混合检索
3. 检索后处理，支持LLM Rerank/ColbertRerank，对上面检索出来的内容进行重排以得到更准确的数据
4. 数据更新，增加文本与python对象
5. 数据保存及恢复，不用每次都进行向量化

## 前置准备
- 安装RAG模块
```
# 从pypi安装
pip install metagpt[rag]
```
```
# 从源码安装
pip install -e .[rag]
```
- 注意点
```
1. 有些模块比较大，采用延迟加载，需要自行安装，比如要使用ColbertRerank，需安装`llama-index-postprocessor-colbert-rerank`
```

## 1. 数据输入
### 示例 1.1: 文件或目录
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
在这个示例中，我们使用最简配置，输入文件，接收一个问题，并打印出查询结果。

### 示例 1.2: 自定义对象
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
在这个示例中，我们使用最简配置，定义Player对象，其中最重要的是自定义对象需满足接口（具体查看[RAGObject](https://github.com/geekan/MetaGPT/blob/main/metagpt/rag/interface.py)），输入文件，接收一个问题，并打印出查询结果。
## 2. 检索功能
### 示例 2.1: faiss检索
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
在这个示例中，我们使用faiss进行检索，其中更多参数可查看FAISSRetrieverConfig。
### 示例 2.2: faiss和bm25混合检索
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
在这个示例中，我们使用faiss和bm25进行混合检索，把两种检索出来的结果去重结合。
## 3. 检索后处理
### 示例 3.1: LLM重排
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
在这个示例中，我们先使用faiss进行检索，然后对检索出来的结果再用LLMRanker进行重排，得到最后检索的结果。
## 4.数据更新
### 示例 4.1: 增加文本与python对象
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
在这个示例中，我们创建engine后，可以添加文档或者对象，最重要的是，如果自定义retriever需要实现接口[ModifiableRAGRetriever](https://github.com/geekan/MetaGPT/blob/main/metagpt/rag/retrievers/base.py)
## 5.数据保存及恢复
### 示例 5.1
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
在这个示例中，我们先把向量化相关数据保存在persist_dir，然后从persist_dir进行恢复后查询