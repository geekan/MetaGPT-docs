# 设置

使用MetaGPT需要配置模型API。我们将在本页面中介绍设置过程。

在[安装](./installation.md)完成后，请按照本文档中的说明完成配置，然后开始使用。
目前，该项目的示例只需要配置OpenAI API。

## 配置大模型API

### OpenAI API

我们以OpenAI API为例说明配置过程，其他大模型的API配置过程是相同的。

您可以通过设置 config2.yaml 完成配置

#### 使用`config2.yaml`

1. 在当前工作目录中创建一个名为`config`的文件夹，并在其中添加一个名为`config2.yaml`的新文件。
2. 将示例[config2.yaml](https://github.com/geekan/MetaGPT/blob/main/config/config2.yaml)文件的内容复制到您的新文件中。
3. 将您自己的值填入文件中：

```yaml
llm:
  api_key: 'sk-...' # YOUR_API_KEY
  model: 'gpt-4-turbo-preview' # or gpt-3.5-turbo-1106 / gpt-4-1106-preview
  # base_url: 'https://api.openai.com/v1'  # or any forward url.
  # proxy: 'YOUR_PROXY'  # Optional. If you want to use a proxy, set it here.
```

请记住：如果您按照[安装](./installation)中的`git clone`方法，`config/config2.yaml`
文件已经存在。只需编辑它或创建一个名为`~/.metagpt/config2.yaml`的副本进行编辑。这样您就不会意外地使用git提交和共享您的API密钥。

> 注意：
> MetaGPT将按照以下优先顺序读取您的设置：`~/.metagpt/config2.yaml > config/config2.yaml`

现在您可以开始使用了！请参阅[快速入门](./quickstart)或我们的[教程](/guide/tutorials/agent_101)以进行第一次运行！

MetaGPT还支持各种LLM模型，根据您的需求配置模型API的密钥。

### 智谱 API

Check [llm_config.py](https://github.com/geekan/MetaGPT/blob/dev/metagpt/configs/llm_config.py) for more details.

```yaml
llm:
  api_type: 'zhipuai'
  api_key: 'YOUR_API_KEY'
  model: 'MODEL_NAME'
```

### 科大讯飞的大模型 Spark API：

Check [llm_config.py](https://github.com/geekan/MetaGPT/blob/dev/metagpt/configs/llm_config.py) for more details.

```yaml
llm:
  api_type: 'spark'
  app_id: 'YOUR_APPID'
  api_key: 'YOUR_API_KEY'
  api_secret: 'YOUR_API_SECRET'
  domain: 'generalv2'
  base_url: 'wss://spark-api.xf-yun.com/v3.1/chat'
```

### Azure OpenAI API

Check [llm_config.py](https://github.com/geekan/MetaGPT/blob/dev/metagpt/configs/llm_config.py) for more details.

```yaml
llm:
  api_type: 'azure'
  api_key: 'YOUR_API_KEY'
  model: 'YOUR_MODEL_NAME'
```

### 百度 千帆 API

支持`ERNIE-*`模型和部分主流开源模型，详见`metagpt/utils/token_counter.py`

#### 使用安全认证AK/SK鉴权

使用`model`进行调用

```yaml
llm:
  api_type: qianfan
  access_key: 'YOUR_ACCESS_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  model: 'YOUR_MODEL_NAME like ERNIE-Bot-turbo'
```

使用`endpoint`进行调用

```yaml
llm:
  api_type: qianfan
  access_key: 'YOUR_ACCESS_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  endpoint: 'YOUR_ENDPOINT_NAME like ernie_speed'
```

#### 使用应用AK/SK鉴权（不推荐）

使用`model`进行调用

```yaml
llm:
  api_type: qianfan
  api_key: 'YOUR_API_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  model: 'YOUR_MODEL_NAME like ERNIE-Bot-turbo'
```

使用`endpoint`进行调用

```yaml
llm:
  api_type: qianfan
  api_key: 'YOUR_API_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  endpoint: 'YOUR_ENDPOINT_NAME like ernie_speed'
```

### 阿里云 灵积 DashScope API

支持`qwen-*`模型和部分主流开源模型，详见`metagpt/utils/token_counter.py`

```yaml
llm:
  api_type: dashscope
  api_key: 'YOUR_API_KEY'
  model: 'YOUR_ENDPOINT_NAME like qwen-max'
```

## 配置工具（可选）

除了让智能体能调用大模型，我们时常期望智能体能调用工具。我们需要配置好所需工具以完成准备工作。

### 网页搜索 API

Check [search_config.py](https://github.com/geekan/MetaGPT/blob/dev/metagpt/configs/search_config.py) for more details.

```yaml
## Supported api_type: serpapi/google/serper/ddg
## serper: Visit https://serper.dev/ to get key.
## serpapi: Visit https://serpapi.com/ to get key.
## google: Visit https://console.cloud.google.com/apis/credentials to get key.
## ddg: it is free, no need to get key.
search:
  api_type: 'google' # serpapi/google/serper/ddg
  api_key: 'YOUR_API_KEY'
  cse_id: 'YOUR_CSE_ID' # only for google
```

### 网页浏览

```yaml
browser:
  engine: 'playwright' # playwright/selenium
  # for playwright engine, please check https://playwright.dev/python/docs/api/class-browsertype
  # for selenium engine, please check https://www.selenium.dev/documentation/webdriver/browsers
  browser_type: 'chrome' # playwright: chromium/firefox/webkit; selenium: chrome/firefox/edge/ie
```

### Azure TTS

```yaml
azure_tts_subscription_key: 'YOUR_API_KEY'
azure_tts_region: 'eastus'
```

### Mermaid

Check [mermaid_config.py](https://github.com/geekan/MetaGPT/blob/dev/metagpt/configs/mermaid_config.py) for more details.

```yaml
mermaid:
  engine: 'nodejs' # nodejs/ink/playwright/pyppeteer
  path: 'mmdc' # such as './node_modules/.bin/mmdc'
  puppeteer_config: './config/puppeteer-config' # only for nodejs
  pyppeteer_path: '/usr/bin/google-chrome-stable' # only for pyppeteer
```

## 其他配置（可选）

Check [config2.example.yaml](https://github.com/geekan/MetaGPT/blob/dev/config/config2.example.yaml) and
[config2.py](https://github.com/geekan/MetaGPT/blob/dev/metagpt/config2.py) for more details.

```yaml
enable_longterm_memory: false
prompt_schema: json #json or markdown
```
