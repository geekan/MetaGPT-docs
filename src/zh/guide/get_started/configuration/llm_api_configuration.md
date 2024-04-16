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
  api_type: 'openai' # or azure / ollama / open_llm etc. Check LLMType for more options
  api_key: 'sk-...' # YOUR_API_KEY
  model: 'gpt-4-turbo-preview' # or gpt-3.5-turbo-1106 / gpt-4-1106-preview
  # base_url: 'https://api.openai.com/v1'  # or any forward url.
  # proxy: 'YOUR_LLM_PROXY_IF_NEEDED'  # Optional. If you want to use a proxy, set it here.
  # pricing_plan: 'YOUR_PRICING_PLAN' # Optional. If your pricing plan uses a different name than the `model`.
```

请记住：如果您按照[安装](./installation)中的`git clone`方法，`config/config2.yaml`
文件已经存在。只需编辑它或创建一个名为`~/.metagpt/config2.yaml`的副本进行编辑。这样您就不会意外地使用git提交和共享您的API密钥。

> 注意：
> MetaGPT将按照以下优先顺序读取您的设置：`~/.metagpt/config2.yaml > config/config2.yaml`

现在您可以开始使用了！请参阅[快速入门](./quickstart)或我们的[教程](/guide/tutorials/agent_101)以进行第一次运行！

MetaGPT还支持各种LLM模型，根据您的需求配置模型API的密钥。

## Anthropic / Claude API

支持模型名列表，在`metagpt/utils/token_counter.py`的`claude-*`

```yaml
llm:
  api_type: 'claude' # 或 anthropic
  base_url: 'https://api.anthropic.com'
  api_key: 'YOUR_API_KEY'
  model: 'claude-3-opus-20240229'
```

## 智谱 API

访问 [llm_config.py](https://github.com/geekan/MetaGPT/blob/main/metagpt/configs/llm_config.py) 获得更新详情。

```yaml
llm:
  api_type: 'zhipuai'
  api_key: 'YOUR_API_KEY'
  model: 'MODEL_NAME'
```

## 科大讯飞的大模型 Spark API：

访问 [llm_config.py](https://github.com/geekan/MetaGPT/blob/main/metagpt/configs/llm_config.py) 获得更新详情。

```yaml
llm:
  api_type: 'spark'
  app_id: 'YOUR_APPID'
  api_key: 'YOUR_API_KEY'
  api_secret: 'YOUR_API_SECRET'
  domain: 'generalv2'
  base_url: 'wss://spark-api.xf-yun.com/v3.1/chat'
```

## Azure OpenAI API

访问 [llm_config.py](https://github.com/geekan/MetaGPT/blob/main/metagpt/configs/llm_config.py) 获得更新详情。

```yaml
llm:
  api_type: 'azure'
  base_url: 'YOUR_AZURE_BASE_URL'
  api_key: 'YOUR_API_KEY'
  api_version: 'YOUR_API_VERSION' # such as '2024-03-01-preview'
  model: 'YOUR_MODEL_NAME'
```

## 谷歌 Gemini

默认支持模型`gemini-pro`

```yaml
llm:
  api_type: 'gemini'
  api_key: 'YOUR_API_KEY'
  model: 'gemini-pro'
```

## 百度 千帆 API

支持`ERNIE-*`模型和部分主流开源模型，详见`metagpt/utils/token_counter.py`

### 使用安全认证AK/SK鉴权

使用`model`进行调用

```yaml
llm:
  api_type: 'qianfan'
  access_key: 'YOUR_ACCESS_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  model: 'YOUR_MODEL_NAME like ERNIE-Bot-turbo'
```

使用`endpoint`进行调用

```yaml
llm:
  api_type: 'qianfan'
  access_key: 'YOUR_ACCESS_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  endpoint: 'YOUR_ENDPOINT_NAME like ernie_speed'
```

### 使用应用AK/SK鉴权（不推荐）

使用`model`进行调用

```yaml
llm:
  api_type: 'qianfan'
  api_key: 'YOUR_API_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  model: 'YOUR_MODEL_NAME like ERNIE-Bot-turbo'
```

使用`endpoint`进行调用

```yaml
llm:
  api_type: 'qianfan'
  api_key: 'YOUR_API_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  endpoint: 'YOUR_ENDPOINT_NAME like ernie_speed'
```

## 阿里云 灵积 DashScope API

支持`qwen-*`模型和部分主流开源模型，详见`metagpt/utils/token_counter.py`

```yaml
llm:
  api_type: 'dashscope'
  api_key: 'YOUR_API_KEY'
  model: 'YOUR_ENDPOINT_NAME like qwen-max'
```

## 月之暗面 Moonshot / Kimi API

支持 `moonshot-v1-*`模型，详见`metagpt/utils/token_counter.py`

```yaml
llm:
  api_type: 'moonshot'
  base_url: 'https://api.moonshot.cn/v1'
  api_key: 'YOUR_API_KEY'
  model: 'moonshot-v1-8k'
```

## Fireworks API

支持 `Fireworks`models模型，详见`metagpt/utils/token_counter.py`

```yaml
llm:
  api_type: 'fireworks'
  base_url: 'https://api.fireworks.ai/inference/v1'
  api_key: 'YOUR_API_KEY'
  model: 'accounts/fireworks/models/llama-v2-13b-chat'
```

## Mistral API

支持 `Mistral`models模型，详见`metagpt/utils/token_counter.py`

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

## ollama API

```yaml
llm:
  api_type: 'ollama'
  base_url: 'http://127.0.0.1:11434/api'
  model: 'llama2'
```

## WizardLM-2-8x22b via [openrouter](https://openrouter.ai/)

If you need wizardlm-2-8x22b, you can use the following configuration:

```yaml
llm:
  api_type: 'open_llm'
  base_url: 'https://openrouter.ai/api/v1'
  api_key: 'sk...'
  model: microsoft/wizardlm-2-8x22b
```
