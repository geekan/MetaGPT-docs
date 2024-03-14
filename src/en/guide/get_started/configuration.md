# Configuration

## LLM API Configuration Steps

After completing the installation, follow these steps to configure the LLM API, using the OpenAI API as an example. This process is similar for other LLM APIs.

1. **Initialize Configuration**:

   - Execute `metagpt --init-config` to generate `~/.metagpt/config2.yaml`. Edit this file with your configurations to avoid sharing your API key by accident.

2. **Edit Configuration**:

   - Update `~/.metagpt/config2.yaml` according to the [example](https://github.com/geekan/MetaGPT/blob/main/config/config2.example.yaml) and [configuration code](https://github.com/geekan/MetaGPT/blob/main/metagpt/config2.py):

```yaml
llm:
  api_type: 'openai' # or azure / ollama / open_llm etc. Check LLMType for more options
  model: 'gpt-4-turbo-preview' # or gpt-3.5-turbo-1106 / gpt-4-1106-preview
  base_url: 'https://api.openai.com/v1' # or forward url / other llm url
  api_key: 'YOUR_API_KEY'
  # proxy: 'YOUR_LLM_PROXY_IF_NEEDED' # Optional. If you want to use a proxy, set it here.
  # pricing_plan: 'YOUR_PRICING_PLAN' # Optional. If your pricing plan uses a different name than the `model`.
```

> **Note**:
> Configuration priority is `~/.metagpt/config2.yaml > config/config2.yaml`.

With these steps, your setup is complete. For starting with MetaGPT, check out the [Quickstart guide](./quickstart) or our [Tutorials](/en/guide/tutorials/agent_101).

MetaGPT supports a range of LLM models. Configure your model API keys as needed.

### Anthropic / Claude API

supported model list, see `claude-*` inside `metagpt/utils/token_counter.py`

```yaml
llm:
  api_type: 'claude' # or anthropic
  base_url: 'https://api.anthropic.com'
  api_key: 'YOUR_API_KEY'
  model: 'claude-3-opus-20240229'
```

### Zhipu API

Check [llm_config.py](https://github.com/geekan/MetaGPT/blob/dev/metagpt/configs/llm_config.py)

```yaml
llm:
  api_type: 'zhipuai'
  api_key: 'YOUR_API_KEY'
  model: 'MODEL_NAME'
```

### iFlytek's large model Spark API :

Check [llm_config.py](https://github.com/geekan/MetaGPT/blob/dev/metagpt/configs/llm_config.py)

Normally YOU only need to modify `SPARK_APPID` `SPARK_API_SECRET` `SPARK_API_KEY`

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

Check [llm_config.py](https://github.com/geekan/MetaGPT/blob/dev/metagpt/configs/llm_config.py)

```yaml
llm:
  api_type: 'azure'
  base_url: 'YOUR_AZURE_BASE_URL'
  api_key: 'YOUR_API_KEY'
  api_version: 'YOUR_API_VERSION'
  model: 'YOUR_MODEL_NAME'
```

### Google Gemini

supports default model `gemini-pro`

```yaml
llm:
  api_type: 'gemini'
  api_key: 'YOUR_API_KEY'
```

### Baidu QianFan API

support `ERNIE-*` models and some popular open-source models, see `metagpt/utils/token_counter.py`

#### Use security authentication AK/SK to authenticate

use `model`

```yaml
llm:
  api_type: qianfan
  access_key: 'YOUR_ACCESS_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  model: 'YOUR_MODEL_NAME like ERNIE-Bot-turbo'
```

use `endpoint`

```yaml
llm:
  api_type: qianfan
  access_key: 'YOUR_ACCESS_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  endpoint: 'YOUR_ENDPOINT_NAME like ernie_speed'
```

#### Use application AK/SK to authenticate (Not Recommended)

use `model`

```yaml
llm:
  api_type: qianfan
  api_key: 'YOUR_API_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  model: 'YOUR_MODEL_NAME like ERNIE-Bot-turbo'
```

use `endpoint`  
for parts of self-deployed models

```yaml
llm:
  api_type: qianfan
  api_key: 'YOUR_API_KEY'
  secret_key: 'YOUR_SECRET_KEY'
  endpoint: 'YOUR_ENDPOINT_NAME like ernie_speed'
```

### Aliyun DashScope API

support `qwen-*` models and some popular open-source models, see `metagpt/utils/token_counter.py`

```yaml
llm:
  api_type: dashscope
  api_key: 'YOUR_API_KEY'
  model: 'YOUR_ENDPOINT_NAME like qwen-max'
```

### Moonshot API

support `moonshot-v1-*`models，see `metagpt/utils/token_counter.py`

```yaml
llm:
  api_type: 'moonshot'
  base_url: 'https://api.moonshot.cn/v1'
  api_key: 'YOUR_API_KEY'
  model: 'moonshot-v1-8k'
```

### FireWorks API

support `FireWorks`models，see `metagpt/utils/token_counter.py`

```yaml
llm:
  api_type: 'fireworks'
  base_url: 'https://api.fireworks.ai/inference/v1'
  api_key: 'YOUR_API_KEY'
  model: 'accounts/fireworks/models/llama-v2-13b-chat'
```

### Mistral API

support `Mistral`models，see `metagpt/utils/token_counter.py`

```yaml
llm:
  api_type: 'mistral'
  base_url: 'https://api.mistral.ai/v1'
  api_key: 'YOUR_API_KEY'
  model: 'open-mixtral-8x7b'
```

### Yi / lingyiwanwu API
support `yi-34b-*`models，see `metagpt/utils/token_counter.py`  

```yaml
llm:
  api_type: 'yi'
  base_url: 'https://api.lingyiwanwu.com/v1'
  api_key: 'YOUR_API_KEY'
  model: 'yi-34b-chat-0205'
  max_token: 4000
```

## Configuration for tools (Optional)

In addition to LLM, we often want agents to use tools. We cover their setup in this section.

### Web searching API

Check [search_config.py](https://github.com/geekan/MetaGPT/blob/dev/metagpt/configs/search_config.py)

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

### Web browsing

Check [browser_config.py](https://github.com/geekan/MetaGPT/blob/dev/metagpt/configs/browser_config.py)

```yaml
browser:
  engine: 'playwright' # playwright/selenium
  # for playwright engine, please check https://playwright.dev/python/docs/api/class-browsertype
  # for selenium engine, please check https://www.selenium.dev/documentation/webdriver/browsers
  browser_type: 'chrome' # playwright: chromium/firefox/webkit; selenium: chrome/firefox/edge/ie
```

### Azure TTS

```yaml
#### for TTS
azure_tts_subscription_key: 'YOUR_API_KEY'
azure_tts_region: 'eastus'
```

### Mermaid

Check [mermaid_config.py](https://github.com/geekan/MetaGPT/blob/dev/metagpt/configs/mermaid_config.py)

```yaml
mermaid:
  engine: 'nodejs' # nodejs/ink/playwright/pyppeteer
  path: 'mmdc' # such as './node_modules/.bin/mmdc'
  puppeteer_config: './config/puppeteer-config' # only for nodejs
  pyppeteer_path: '/usr/bin/google-chrome-stable' # only for pyppeteer
```

## Others (Optional)

Check [config2.example.yaml](https://github.com/geekan/MetaGPT/blob/dev/config/config2.example.yaml) and
[config2.py](https://github.com/geekan/MetaGPT/blob/dev/metagpt/config2.py) for more details.

```yaml
enable_longterm_memory: false
prompt_schema: json #json or markdown
```
