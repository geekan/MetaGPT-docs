# 配置大模型API

## OpenAI API

我们以OpenAI API为例说明配置过程，其他大模型的API配置过程是相同的。

您可以通过设置 config2.yaml 完成配置

### 使用`config2.yaml`

1. 在当前工作目录中创建一个名为`config`的文件夹，并在其中添加一个名为`config2.yaml`的新文件。
2. 将示例[config2.yaml](https://github.com/geekan/MetaGPT/blob/main/config/config2.yaml)文件的内容复制到您的新文件中。
3. 将您自己的值填入文件中：

```yaml
llm:
  api_type: 'openai' # 或 azure/ollama/groq 等，更多选项请查看 LLMType
  model: 'gpt-4-turbo' # 或 gpt-3.5-turbo
  base_url: 'https://api.openai.com/v1' # 或转发地址/其他LLM地址
  api_key: 'YOUR_API_KEY'
  # proxy: 'YOUR_LLM_PROXY_IF_NEEDED' # 可选。如需使用代理请在此设置
  # pricing_plan: 'YOUR_PRICING_PLAN' # 可选。如果您的资费计划名称与`model`不同
```

> **注意**：
> 配置优先级为 `~/.metagpt/config2.yaml > config/config2.yaml`

如需使用OpenAI o1系列模型，需要添加以下额外配置：

```yaml
llm:
  api_type: 'openai'
  api_key: 'sk-...'
  model: 'o1-mini'
  use_system_prompt: false
  stream: false
```

该配置可用于初始化LLM。由于o1系列存在使用限制，遇到问题请及时向我们反馈。

完成上述步骤后，您的配置即告完成。要开始使用MetaGPT，请查看[快速入门指南](./quickstart)或我们的[教程](/en/guide/tutorials/agent_101)。

MetaGPT还支持各种LLM模型，根据您的需求配置模型API的密钥。

## Anthropic / Claude API

支持模型列表请查看 `metagpt/utils/token_counter.py` 中的 `claude-*` 系列

```yaml
llm:
  api_type: 'claude' # 或 anthropic
  base_url: 'https://api.anthropic.com'
  api_key: 'YOUR_API_KEY'
  model: 'claude-3-opus-20240229'
```

## 智谱AI API

完整配置请参考[llm_config.py](https://github.com/geekan/MetaGPT/blob/main/metagpt/configs/llm_config.py)

```yaml
llm:
  api_type: 'zhipuai'
  api_key: 'YOUR_API_KEY'
  model: 'MODEL_NAME'
```

## 科大讯飞的大模型 Spark API：

访问 [llm_config.py](https://github.com/geekan/MetaGPT/blob/main/metagpt/configs/llm_config.py) 获得更新详情。

通常只需修改 `SPARK_APPID`、`SPARK_API_SECRET` 和 `SPARK_API_KEY`

```yaml
llm:
  api_type: 'spark'
  app_id: 'YOUR_APPID'
  api_key: 'YOUR_API_KEY'
  api_secret: 'YOUR_API_SECRET'
  domain: 'generalv3'
  base_url: 'wss://spark-api.xf-yun.com/v3.1/chat'
```

## Azure OpenAI API

完整配置请参考[llm_config.py](https://github.com/geekan/MetaGPT/blob/main/metagpt/configs/llm_config.py)

```yaml
llm:
  api_type: 'azure'
  base_url: 'YOUR_AZURE_BASE_URL'
  api_key: 'YOUR_API_KEY'
  api_version: 'YOUR_API_VERSION' # 例如 '2024-03-01-preview'
  model: 'YOUR_MODEL_NAME' # 或您的部署名称
```

## 谷歌 Gemini

默认支持模型 `gemini-pro`

```yaml
llm:
  api_type: 'gemini'
  api_key: 'YOUR_API_KEY'
  model: 'gemini-pro'
```

## 百度 千帆 API

支持 `ERNIE-*` 模型及主流开源模型，完整列表见 `metagpt/utils/token_counter.py`

### 使用安全认证AK/SK鉴权

使用`model`进行调用

```yaml
llm:
  api_type: 'qianfan'
  access_key: 'YOUR_ACCESS_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  model: 'ERNIE-Bot-turbo' # 示例模型名称
```

使用`endpoint`进行调用

```yaml
llm:
  api_type: 'qianfan'
  access_key: 'YOUR_ACCESS_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  endpoint: 'ernie_speed' # 示例终端节点名称
```

### 使用应用AK/SK鉴权（不推荐）

使用`model`参数：

```yaml
llm:
  api_type: 'qianfan'
  api_key: 'YOUR_API_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  model: 'ERNIE-Bot-turbo' # 示例模型名称
```

使用`endpoint`参数（适用于自部署模型）：

```yaml
llm:
  api_type: 'qianfan'
  api_key: 'YOUR_API_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  endpoint: 'ernie_speed' # 示例终端节点名称
```

## 阿里云 灵积 DashScope API

支持 `qwen-*` 模型及主流开源模型，完整列表见 `metagpt/utils/token_counter.py`

```yaml
llm:
  api_type: 'dashscope'
  api_key: 'YOUR_API_KEY'
  model: 'qwen-max' # 示例模型名称
```

## 月之暗面 Moonshot / Kimi API

支持 `moonshot-v1-*` 模型，完整列表见 `metagpt/utils/token_counter.py`

```yaml
llm:
  api_type: 'moonshot'
  base_url: 'https://api.moonshot.cn/v1'
  api_key: 'YOUR_API_KEY'
  model: 'moonshot-v1-8k'
```

## Fireworks API

支持 `Fireworks` 模型，完整列表见 `metagpt/utils/token_counter.py`

```yaml
llm:
  api_type: 'fireworks'
  base_url: 'https://api.fireworks.ai/inference/v1'
  api_key: 'YOUR_API_KEY'
  model: 'accounts/fireworks/models/llama-v2-13b-chat'
```

## Mistral API

支持 `Mistral` 模型，完整列表见 `metagpt/utils/token_counter.py`

```yaml
llm:
  api_type: 'mistral'
  base_url: 'https://api.mistral.ai/v1'
  api_key: 'YOUR_API_KEY'
  model: 'open-mixtral-8x7b'
```

## Yi / 零一万物 API

支持模型名列表，在`metagpt/utils/token_counter.py`的`yi-34b-*`

```yaml
llm:
  api_type: 'yi'
  base_url: 'https://api.lingyiwanwu.com/v1'
  api_key: 'YOUR_API_KEY'
  model: 'yi-34b-chat-0205'
  max_token: 4000
```

## Ollama API

```yaml
llm:
  api_type: 'ollama'
  base_url: 'http://127.0.0.1:11434/api'
  model: 'llama2'
```

## 通过[OpenRouter](https://openrouter.ai/)使用WizardLM-2-8x22b

如需使用 [wizardlm-2-8x22b](https://openrouter.ai/models/microsoft/wizardlm-2-8x22b)，请使用以下配置：

```yaml
llm:
  api_type: 'openrouter'
  base_url: 'https://openrouter.ai/api/v1'
  api_key: 'sk...'
  model: microsoft/wizardlm-2-8x22b
```

## 通过[OpenRouter](https://openrouter.ai/)使用Llama-3-70b-instruct

如需使用 [llama-3-70b-instruct](https://openrouter.ai/models/meta-llama/llama-3-70b-instruct:nitro)，请使用以下配置：

```yaml
llm:
  api_type: 'openrouter'
  base_url: 'https://openrouter.ai/api/v1'
  api_key: 'sk...'
  model: meta-llama/llama-3-70b-instruct:nitro
```

## 通过[Groq](https://groq.com/)使用Llama-3-70b

如需使用llama3-70b，请使用以下配置：

```yaml
llm:
  # 访问 https://console.groq.com/keys 创建API密钥
  base_url: 'https://api.groq.com/openai/v1'
  api_key: 'YOUR_API_KEY'
  model: 'llama3-70b-8192' # 可选模型：llama3-8b-8192，llama3-70b-8192，llama2-70b-4096，mixtral-8x7b-32768，gemma-7b-it
```

## [Amazon Bedrock API](https://aws.amazon.com/bedrock)

可以在 [Amazon IAM](https://aws.amazon.com/iam) 中获取对应的Key

所有支持的模型可在 `metagpt/provider/bedrock/utils.py` 中查看

> 注意，对于账单在中国大陆内的用户、claude和cohere可能无法使用

```yaml
llm:
  api_type: 'bedrock'
  model: 'meta.llama3-70b-instruct-v1:0'
  region_name: 'REGION' # 例如 us-east-1
  access_key: 'YOUR_ACCESS_KEY'
  secret_key: 'YOUR_SECRET_KEY'
```

## 火山方舟API

支持模型名列表，在`metagpt/utils/token_counter.py`的`doubao-*`

```yaml
llm:
  api_type: 'ark'
  base_url: 'https://ark.cn-beijing.volces.com/api/v3'
  api_key: 'YOUR_API_KEY'
  access_key: 'YOUR_ACCESS_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  model: 'doubao-lite'
```
