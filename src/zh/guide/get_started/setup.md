# 设置

使用MetaGPT需要配置模型API。我们将在本页面中介绍设置过程。

在[安装](./installation.md)完成后，请按照本文档中的说明完成配置，然后开始使用。
目前，该项目的示例只需要配置OpenAI API。

## 配置大模型API

### OpenAI API

我们以OpenAI API为例说明配置过程，其他大模型的API配置过程是相同的。

您可以通过以下两种方式完成设置：

1. 使用环境变量。这可以用于临时快速启动或尝试演示。
2. 使用key.yaml配置。这是推荐的方式，适用于持续和全功能的使用和开发。

#### 1. 使用环境变量

在命令行中运行：

```shell
export OPENAI_API_KEY="sk-..."  # YOUR_API_KEY
export OPENAI_API_MODEL="intended model" # gpt-4, gpt-3.5-turbo, 等等
```

或在Python中：

```python
import os

os.environ["OPENAI_API_KEY"] = "sk-..."  # YOUR_API_KEY
os.environ["OPENAI_API_MODEL"] = "intended model"  # gpt-4, gpt-3.5-turbo, 等等
```

#### 2.使用一个`config.yaml`或者`key.yaml`文件

1. 在当前工作目录中创建一个名为`config`的文件夹，并在其中添加一个名为`key.yaml`的新文件。
2. 将示例[config.yaml](https://github.com/geekan/MetaGPT/blob/main/config/config.yaml)文件的内容复制到您的新文件中。
3. 将您自己的值填入文件中：

```yaml
OPENAI_API_KEY: 'sk-...' # YOUR_API_KEY
OPENAI_API_MODEL: 'intended model' # gpt-4, gpt-3.5-turbo, 等等
```

请记住：如果您按照[安装](./installation)中的`git clone`方法，`config/config.yaml`
文件已经存在。只需编辑它或创建一个名为`config/key.yaml`的副本进行编辑。这样您就不会意外地使用git提交和共享您的API密钥。

> 注意：
> MetaGPT将按照以下优先顺序读取您的设置：`config/key.yaml > config/config.yaml > 环境变量`

现在您可以开始使用了！请参阅[快速入门](./quickstart)或我们的[教程](/guide/tutorials/agent_101)以进行第一次运行！

MetaGPT还支持各种LLM模型，根据您的需求配置模型API的密钥。

### 智谱 API

```yaml
#### 关于智谱，搜索`https://open.bigmodel.cn`。您可以在此设置，或export API_KEY="YOUR_API_KEY"
ZHIPUAI_API_KEY: 'YOUR_API_KEY'
```

### 科大讯飞的大模型 Spark API：

```yaml
#### 如果是Spark
### 通常您只需要修改 SPARK_APPID、SPARK_API_SECRET和SPARK_API_KEY
SPARK_APPID: 'YOUR_APPID'
SPARK_API_SECRET: 'YOUR_API_SECRET'
SPARK_API_KEY: 'YOUR_API_KEY'
DOMAIN: 'generalv2'
SPARK_URL: 'ws://spark-api.xf-yun.com/v2.1/chat'
```

### 基于Azure的Openai

```yaml
#### 如果是AZURE，请参考https://github.com/openai/openai-cookbook/blob/main/examples/azure/chat.ipynb
#### 您可以使用ENGINE或DEPLOYMENT模式
OPENAI_API_TYPE: 'azure'
OPENAI_API_BASE: 'YOUR_AZURE_ENDPOINT'
OPENAI_API_KEY: 'YOUR_AZURE_API_KEY'
OPENAI_API_VERSION: 'YOUR_AZURE_API_VERSION'
DEPLOYMENT_NAME: 'YOUR_DEPLOYMENT_NAME'
DEPLOYMENT_ID: 'YOUR_DEPLOYMENT_ID'
```

## 配置工具（可选）

除了让智能体能调用大模型，我们时常期望智能体能调用工具。我们需要配置好所需工具以完成准备工作。

### 网页搜索 API

```yaml
#### 用于搜索

## 可选值：serpapi/google/serper/ddg
SEARCH_ENGINE: serpapi

## 访问 https://serpapi.com/ 获取密钥。
SERPAPI_API_KEY: 'YOUR_API_KEY'

## 访问 https://console.cloud.google.com/apis/credentials 获取密钥。
GOOGLE_API_KEY: 'YOUR_API_KEY'
## 访问 https://programmablesearchengine.google.com/controlpanel/create 获取ID。
GOOGLE_CSE_ID: 'YOUR_CSE_ID'

## 访问 https://serper.dev/ 获取密钥。
SERPER_API_KEY: 'YOUR_API_KEY'
```

### 网页浏览

```yaml
#### 用于访问网站

## 可选值：playwright/selenium
WEB_BROWSER_ENGINE: playwright

## 可选值：chromium/firefox/webkit，访问 https://playwright.dev/python/docs/api/class-browsertype
PLAYWRIGHT_BROWSER_TYPE: chromium

## 可选值：chrome/firefox/edge/ie，访问 https://www.selenium.dev/documentation/webdriver/browsers/
SELENIUM_BROWSER_TYPE: chrome
```

### Azure TTS

```yaml
#### 用于TTS

AZURE_TTS_SUBSCRIPTION_KEY: 'YOUR_API_KEY'
AZURE_TTS_REGION: 'eastus'
```

### Stable Diffusion 本地部署

```yaml
#### 用于Stable Diffusion
## 使用SD服务，基于 https://github.com/AUTOMATIC1111/stable-diffusion-webui
SD_URL: 'YOUR_SD_URL'
SD_T2I_API: '/sdapi/v1/txt2img'
```

## 其他配置（可选）

```yaml
#### 用于执行
LONG_TERM_MEMORY: false
#### 用于Mermaid CLI
## 如果您只为metagpt安装了mmdc（Mermaid CLI），请启用以下配置。
PUPPETEER_CONFIG: './config/puppeteer-config.json'
MMDC: './node_modules/.bin/mmdc'

### 用于计算使用量
CALC_USAGE: false

### 用于搜索
MODEL_FOR_RESEARCHER_SUMMARY: gpt-3.5-turbo
MODEL_FOR_RESEARCHER_REPORT: gpt-3.5-turbo-16k

### 选择Mermaid转换的引擎，
# 默认为nodejs，您可以将其更改为playwright、pyppeteer或ink
MERMAID_ENGINE: nodejs

### pyppeteer引擎的浏览器路径，支持Chrome、Chromium、MS Edge
PYPPETEER_EXECUTABLE_PATH: '/usr/bin/google-chrome-stable'

PROMPT_FORMAT: json #json或markdown
```
