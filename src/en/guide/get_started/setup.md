# Setup

Using MetaGPT involves connecting with model providers. We will walk through the setup in this page.

After your [Installation](./installation.md) is complete, follow the instructions in this document to complete the
configuration before use.
At the moment, the example of this project only needs to configure OpenAi API.

## OpenAI API

We will take OpenAI API as an example. You can finish the setup in either way:

1. Use environment variables. This can be used temporarily for a quick start or trying out a demo.
2. Use a config or key file. This is the recommended way, best for continuous and full-feature usage and development.

### 1. Use environment variables

Run in command line:

```shell
export OPENAI_API_KEY="sk-..."  # YOUR_API_KEY
export OPENAI_API_MODEL="intended model" # gpt-4, gpt-3.5-turbo, etc.
```

Or in python:

```python
import os

os.environ["OPENAI_API_KEY"] = "sk-..."  # YOUR_API_KEY
os.environ["OPENAI_API_MODEL"] = "intended model"  # gpt-4, gpt-3.5-turbo, etc.
```

### 2. Use a config or key file

1. In your current working directory, create a folder `config` and add a new file named `config.yaml` or `key.yaml`
   under it.
2. Copy the content from the example [config.yaml](https://github.com/geekan/MetaGPT/blob/main/config/config.yaml) file
   into your new files
3. Fill in your own values to the file:

```yaml
OPENAI_API_KEY: 'sk-...' # YOUR_API_KEY
OPENAI_API_MODEL: 'intended model' # gpt-4, gpt-3.5-turbo, etc.
```

Remember: If you follow the `git clone` approach in [Installation](./installation), `config/config.yaml` will already be
there. Just edit it or make a copy named `config/key.yaml` for editting. This way you don't accidentally commit and
share your API key using git.

> Note:
> MetaGPT will read your setup in this priority order: `config/key.yaml > config/config.yaml > environment variable`

Here you are good to go! See [Quickstart](./quickstart) or our [Tutorials](/guide/tutorials/agent_101) for your first
run!

MetaGPT also supports various LLM models, configure the keys of model APIs according to your needs.

## Zhipu API

```yaml
#### if zhipuai from `https://open.bigmodel.cn`. You can set here or export API_KEY="YOUR_API_KEY"
ZHIPUAI_API_KEY: "YOUR_API_KEY"
```

## iFlytek's large model Spark API :

``` yaml
#### if Spark
### Nomally YOU only need to modify SPARK_APPID SPARK_API_SECRET SPARK_API_KEY
SPARK_APPID : "YOUR_APPID"
SPARK_API_SECRET : "YOUR_API_SECRET"
SPARK_API_KEY : "YOUR_API_KEY"
DOMAIN : "generalv2"
SPARK_URL : "ws://spark-api.xf-yun.com/v2.1/chat"
```

## Microsoft Azure Based Openai

``` yaml
#### if AZURE, check https://github.com/openai/openai-cookbook/blob/main/examples/azure/chat.ipynb
#### You can use ENGINE or DEPLOYMENT mode
OPENAI_API_TYPE: "azure"
OPENAI_API_BASE: "YOUR_AZURE_ENDPOINT"
OPENAI_API_KEY: "YOUR_AZURE_API_KEY"
OPENAI_API_VERSION: "YOUR_AZURE_API_VERSION"
DEPLOYMENT_NAME: "YOUR_DEPLOYMENT_NAME"
DEPLOYMENT_ID: "YOUR_DEPLOYMENT_ID"
```

## Web Searching API

``` yaml
#### for Search

## Supported values: serpapi/google/serper/ddg
SEARCH_ENGINE: serpapi

## Visit https://serpapi.com/ to get key.
SERPAPI_API_KEY: "YOUR_API_KEY"

## Visit https://console.cloud.google.com/apis/credentials to get key.
GOOGLE_API_KEY: "YOUR_API_KEY"
## Visit https://programmablesearchengine.google.com/controlpanel/create to get id.
GOOGLE_CSE_ID: "YOUR_CSE_ID"

## Visit https://serper.dev/ to get key.
SERPER_API_KEY: "YOUR_API_KEY"
```

## Website Access For Agent

``` yaml
#### for web access

## Supported values: playwright/selenium
WEB_BROWSER_ENGINE: playwright

## Supported values: chromium/firefox/webkit, visit https://playwright.dev/python/docs/api/class-browsertype
PLAYWRIGHT_BROWSER_TYPE: chromium

## Supported values: chrome/firefox/edge/ie, visit https://www.selenium.dev/documentation/webdriver/browsers/
SELENIUM_BROWSER_TYPE: chrome
```

## Auzre TTS

```` yaml
#### for TTS

AZURE_TTS_SUBSCRIPTION_KEY: "YOUR_API_KEY"
AZURE_TTS_REGION: "eastus"
````

## Stable Diffusion Local Deployment

````yaml
#### for Stable Diffusion
## Use SD service, based on https://github.com/AUTOMATIC1111/stable-diffusion-webui
SD_URL: "YOUR_SD_URL"
SD_T2I_API: "/sdapi/v1/txt2img"

````

## Other Abilities

````yaml 
#### for Execution
LONG_TERM_MEMORY: false
#### for Mermaid CLI
## If you installed mmdc (Mermaid CLI) only for metagpt then enable the following configuration.
PUPPETEER_CONFIG: "./config/puppeteer-config.json"
MMDC: "./node_modules/.bin/mmdc"


### for calc_usage
CALC_USAGE: false

### for Research
MODEL_FOR_RESEARCHER_SUMMARY: gpt-3.5-turbo
MODEL_FOR_RESEARCHER_REPORT: gpt-3.5-turbo-16k

### choose the engine for mermaid conversion, 
# default is nodejs, you can change it to playwright,pyppeteer or ink
MERMAID_ENGINE: nodejs

### browser path for pyppeteer engine, support Chrome, Chromium,MS Edge
PYPPETEER_EXECUTABLE_PATH: "/usr/bin/google-chrome-stable"

PROMPT_FORMAT: json #json or markdown
````