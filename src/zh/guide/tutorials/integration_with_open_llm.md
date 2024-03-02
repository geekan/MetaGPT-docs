# 集成开源LLM

目前，如果要得到比较稳定的代码生成结果，需要使用OpenAI的GPT-3.5或GPT-4。但目前也有很多其他优秀的开源模型可以供实验，也能够得到令人相对满意的结果。因此，在本教程中，我们将探讨如何接入开源LLM并根据你的输入需求得到项目输出。

**注意**  
本教程所述内容由于开源模型效果本身的局限性，并不能保证代码的稳定生成效果。如果你按该教程进行实验，表示你已知晓该点。  
同时，我们也在探索如何在开源模型下得到更稳定、质量更好的输出。如果你对此也感兴趣，可以在discord或者微信社区群里联系我们。  
相信随着开源模型的更新，这一目标将很快到来。

我们将按照下述流程进行教程的整体介绍：

- 模型部署。使用推理仓库比如：LLaMA-Factory、FastChat、ollama等进行对应LLM模型的部署。
- LLM配置。
- 可选的，修复LLM输出结果。
- 运行使用。

集成开源LLM和集成一些非openai的闭源模型（如文心一言、讯飞星火、智谱ChatGLM等）的方式都差不多，主要是配置差异。其他闭源LLM的配置具体可以参考文档站下的其他LLM配置相关文档。配置完成后的其他流程步骤与上述的保持一致。

## 模型部署

注意，推荐使用openai兼容接口进行模型部署。这样，请求和返回处理都可以直接使用openai sdk进行处理，将会简化整体的集成流程。同时，下述几个推理仓库也支持发布为openai兼容的接口（除ollama外），需要改动的工作量很小。

注意，这边默认你是有显卡资源进行部署，不然CPU推理会有点慢。

### LLaMA-Factory

仓库：https://github.com/hiyouga/LLaMA-Factory

##### 安装

```shell
git clone https://github.com/hiyouga/LLaMA-Factory.git
conda create -n llama_factory python=3.10
conda activate llama_factory
cd LLaMA-Factory
pip install -r requirements.txt
```

具体的，可以看[安装](https://github.com/hiyouga/LLaMA-Factory#dependence-installation-optional)

##### 支持模型

常见的LLaMA、Llama2和中国的多数开源模型都支持，具体可看[模型列表](https://github.com/hiyouga/LLaMA-Factory#supported-models)

##### 部署启动

源模型启动

```shell
python3 src/api_demo.py \
    --model_name_or_path meta-llama/Llama-2-13b-chat-hf \
    --template llama2
```

加载合并lora产出启动

```shell
python3 src/api_demo.py \
    --model_name_or_path path_to_llama2_model \
    --template llama2 \
    --finetuning_type lora \
    --checkpoint_dir path_to_checkpoint
```

默认的，接口访问地址为：`http://0.0.0.0:8000/` ，如需修改端口，进入`src/api_demo.py`进行修改。  
如需多卡启动，则在启动命令前加 `CUDA_VISIBLE_DEVICES=0,1,2`，对应换成你的卡号。  
不同的模型支持的`template`值不同，可以从`src/llmtuner/data/template.py`查到。

具体的，可以看[API部署](https://github.com/hiyouga/LLaMA-Factory#api-demo)

##### 请求示例

```shell
curl -X POST http://0.0.0.0:8000/v1/chat/completions -H "content-type:application/json" -d '{
  "messages":[{"role":"user","content":"who are you"}],
  "model": "gpt-3.5-turbo",
  "stream": false,
  "max_tokens": 256
}'
```

默认的，请求的`model`参数值为`gpt-3.5-turbo`，如需修改。进入`src/llmtuner/api/app.py` 的`list_models`方法内修改为你的自定义值。

### FastChat

仓库：https://github.com/lm-sys/FastChat

##### 安装

```shell
pip3 install "fschat[model_worker,webui]"
```

具体的，可以看[安装](https://github.com/lm-sys/FastChat#install)

##### 支持模型

常见的LLaMA、Llama2和中国的多数开源模型都支持，具体可看[模型列表](https://github.com/lm-sys/FastChat#supported-models)

##### 部署启动

流程

- 启动 controller，`python3 -m fastchat.serve.controller`
- 启动源模型 model worker，`python3 -m fastchat.serve.model_worker --model-path lmsys/vicuna-13b-v1.5 --conv-template vicuna_v1.1 --model-names vicuna`
- 启动 openai 兼容接口，`python3 -m fastchat.serve.openai_api_server --host localhost --port 8000`

如果是需要启动lora微调后的模型，需要先做[模型合并](https://github.com/lm-sys/FastChat/blob/main/docs/vicuna_weights_version.md#how-to-apply-delta-weights-only-needed-for-weights-v0)

具体的，可以看[API部署](https://github.com/lm-sys/FastChat/blob/main/docs/openai_api.md)

##### 请求示例

```shell
curl -X POST http://0.0.0.0:8000/v1/chat/completions -H "content-type:application/json" -d '{
  "messages":[{"role":"user","content":"who are you"}],
  "model": "gpt-3.5-turbo",
  "stream": false,
  "max_tokens": 256
}'
```

默认的，请求的`model`参数值为`vicuna`，对应启动`model_worker`时的`model-names`。

#### vllm

仓库：https://github.com/vllm-project/vllm

##### 安装

```shell
pip3 install vllm
```

具体的，可以看[安装](https://docs.vllm.ai/en/latest/getting_started/installation.html)

##### 支持模型

常见的LLaMA、Llama2和中国的多数开源模型都支持，具体可看[模型列表](https://docs.vllm.ai/en/latest/models/supported_models.html)

##### 部署启动

```shell
python3 -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-2-13b-hf \
    --served-model-name llama2-13b
```

具体的，可以看[API部署](https://docs.vllm.ai/en/latest/getting_started/quickstart.html#openai-compatible-server)

##### 请求示例

```shell

curl -X POST http://0.0.0.0:8000/v1/chat/completions -H "content-type:application/json" -d '{
  "messages":[{"role":"user","content":"who are you"}],
  "model": "llama2-13b",
  "stream": false,
  "max_tokens": 256
}'
```

默认的，请求的`model`参数值为`llama2-13b`，对应启动时的`served-model-name`。

### ollama

仓库：https://github.com/jmorganca/ollama

该仓库不支持兼容openai api接口，后续MetaGPT会支持其本身提供的接口方式。

##### 安装

```shell
curl https://ollama.ai/install.sh | sh
```

具体的，可以看[安装](https://github.com/jmorganca/ollama/blob/main/docs/linux.md)

##### 支持模型

主要支持Llama2及其衍生系列，具体可看[模型列表](https://github.com/jmorganca/ollama#model-library)

##### 部署启动

```shell
ollama run llama2  # 下载速度还可以 (10+MB/s)
```

##### 非本地访问

默认情况下启动的ollama服务只能本地访问，即`http://localhost:11434/api/chat` 或 `http://127.0.0.1:11434/api/chat` ，如果想要支持 `http://ip:11434/api/chat` ，可以按下述操作：

```bash
service ollama stop

OLLAMA_HOST=0.0.0.0 OLLAMA_ORIGINS=* ollama serve  # 一个terminal窗口

ollama run llama2                                  # 另一个terminal窗口
```

llama2[使用文档](https://ollama.ai/library/llama2)

具体的，可以看[API部署](https://github.com/jmorganca/ollama/blob/main/docs/api.md)

##### 请求示例

```shell
# 默认是`stream: true`的非流式输出

curl -X POST http://localhost:11434/api/chat -d '{
  "model": "llama2",
  "messages": [
    {
      "role": "user",
      "content": "why is the sky blue?"
    }
  ]
 }'
```

返回结果

```json
{
  "model": "llama2",
  "created_at": "2023-12-21T14:40:31.635304023Z",
  "message": {
    "role": "assistant",
    "content": "The sky appears blue ...."
  },
  "done": true,
  "total_duration": 30355794101,
  "load_duration": 1156507,
  "prompt_eval_count": 26,
  "prompt_eval_duration": 1037945000,
  "eval_count": 288,
  "eval_duration": 29311846000
}
```

## LLM配置

由于上述部署为API接口，因此通过修改配置文件`config/config2.yaml`进行生效。

#### openai兼容接口

如 LLaMA-Factory、FastChat、vllm部署的openai兼容接口

**config/config2.yaml**

```yaml
llm:
  api_type: open_llm
  base_url: 'http://106.75.10.xxx:8000/v1'
  model: 'llama2-13b'
```

openapi chat接口的完整路由`http://0.0.0.0:8000/v1/chat/completions`，`base_url` 只需要配置到`http://0.0.0.0:8000/v1` ，剩余部分openai sdk会补齐。`model`为请求接口参数`model`的实际值。

#### ollama api接口

如通过ollama部署的模型服务

**config/config2.yaml**

```yaml
llm:
  api_type: ollama
  base_url: 'http://127.0.0.1:11434/api'
  model: 'llama2'
```

ollama chat接口的完整路由`http://127.0.0.1:11434/api/chat` ，`base_url` 只需要配置到`http://127.0.0.1:11434/api` ，剩余部分由`OllamaLLM` 补齐。`model` 为请求接口参数`model` 的实际值。

## 可选的，修复LLM输出结果

### 背景

本教程主要是指导如何在MetaGPT中对接开源模型（以及非openai的闭源模型），由于LLM的输出结果与prompt指令格式有很大的关系，开源模型（部分非openai的闭源模型）往往很难跟随MetaGPT的现有角色指令进行输出。一方面，我们会优化角色指令，使得其在多数开闭源模型下有更好的指令结果输出兼容性，另一方面，针对现状情况，对开源LLM的输出内容进行修复，提升整体的执行成功率。

### 开源模型指令输出主要问题

包括部分非openai闭源模型的问题。  
MetaGPT的prompt对输出有较强的结构要求，开源模型输出时，往往很难按指令跟随完整输出，导致输出的内容会存在缺失遗漏、错误的情况，主要表现为：

- 目标key不能按prompt约定的大小写进行输出
- 输出的json纯文本存在缺失或多出特殊字符。如，`{"a":b"}}`，`{"a":b"]}`，`{"a":b"` 等等。

针对上述情况，我们增加了修复开源LLM输出的功能，具体的  
**config/config2.yaml**

```yaml
llm: ...

repair_llm_output: true
```

开启该功能后，执行过程中将尝试去修复上述情况。该开关目前并不能保证完整修复，仍会有些情况我们暂未覆盖（不同的开源模型的情况有所不同），执行过程会中断退出。如果你对此感兴趣，欢迎提PR，并附上对应的模型说明、测试日志和单测用例。

如果你开启了该功能，表示将会对LLM输出（MetaGPT里软件公司里的ProductManager、Architect角色）进行修复，日志中会出现`repair_`的关键词，你可以留意下。

## 运行使用

按上述流程执行后，你就可以开始正式使用了。  
`metagpt "write a snake game"`

### 延伸

MetaGPT本身是一个多智能体框架，不局限于软件项目生成。你也可以结合集成的开源模型在自己的应用场景中构建对应的智能体进行使用。  
开始你的智能体之旅吧~
