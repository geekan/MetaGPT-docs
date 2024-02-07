# Setup

Using MetaGPT involves connecting with model providers. After your [Installation](./installation.md) is complete, follow the instructions in this document to complete the
configuration before use.

## Setup for LLM API

### OpenAI API

We will take OpenAI API as an example to illustrate the full process, which applies identically to other LLM APIs.

You can finish the setup by modifying the `config/config2.yaml`:

#### Use a config2.yaml

1. In your current working directory, create a folder `config` and add a new file named `config2.yaml`
   under it.
2. Copy the content from the example [config2.yaml](https://github.com/geekan/MetaGPT/blob/main/config/config2.yaml) file
   into your new files
3. Fill in your own values to the file:

```yaml
llm:
  api_key: 'sk-...' # YOUR_API_KEY
  model: 'gpt-4-turbo-preview' # or gpt-3.5-turbo-1106 / gpt-4-1106-preview
```

Remember: If you follow the `git clone` approach in [Installation](./installation), `config/config2.yaml` will already be
there. Just edit it or make a copy named `~/.metagpt/config2.yaml` for editting. This way you don't accidentally commit and
share your API key using git.

> Note:
> MetaGPT will read your setup in this priority order: `~/.metagpt/config2.yaml > config/config2.yaml`

Here you are good to go! See [Quickstart](./quickstart) or our [Tutorials](/guide/tutorials/agent_101) for your first
run!

MetaGPT also supports various LLM models, configure the keys of model APIs according to your needs.

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
  api_key: 'YOUR_API_KEY'
  model: 'YOUR_MODEL_NAME'
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

#### Use application AK/SK to authenticate(Not Recommended)

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

## Setup for tools (Optional)

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

Check [config2.yaml.example](https://github.com/geekan/MetaGPT/blob/dev/config/config2.yaml.example) and
[config2.py](https://github.com/geekan/MetaGPT/blob/dev/metagpt/config2.py) for more details.

```yaml
enable_longterm_memory: false
prompt_schema: json #json or markdown
```
