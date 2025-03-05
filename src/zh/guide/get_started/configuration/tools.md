# 配置工具（可选）

除了基础的大语言模型（LLM）调用，我们通常希望智能体能够使用各类工具。本节将介绍相关工具的配置方法。

## 网页搜索 API

查看 [search_config.py](https://github.com/geekan/MetaGPT/blob/main/metagpt/configs/search_config.py) 获取更多详情。

```yaml
## 支持的 api_type: serpapi/google/serper/ddg
## serper: 访问 https://serper.dev/ 获取 API 密钥
## serpapi: 访问 https://serpapi.com/ 获取 API 密钥
## google: 访问 https://console.cloud.google.com/apis/credentials 获取 API 密钥
## ddg: 免费服务，无需 API 密钥
search:
  api_type: 'google' # serpapi/google/serper/ddg
  api_key: 'YOUR_API_KEY'
  cse_id: 'YOUR_CSE_ID' # 仅适用于 google
  params:
    engine: google # 支持 google/bing/yahoo/baidu/yandex，更多细节请查看 https://serpapi.com/bing-search-api
    google_domain: 'google.com'
    gl: us # 地理定位参数
    hl: en # 语言参数
```

## 网页浏览

查看 [browser_config.py](https://github.com/geekan/MetaGPT/blob/main/metagpt/configs/browser_config.py) 获取更多详情。

```yaml
browser:
  engine: 'playwright' # playwright/selenium
  # 使用 playwright 引擎时，请参考 https://playwright.dev/python/docs/api/class-browsertype
  # 使用 selenium 引擎时，请参考 https://www.selenium.dev/documentation/webdriver/browsers
  browser_type: 'chrome' # playwright: chromium/firefox/webkit; selenium: chrome/firefox/edge/ie
```

## Azure 文本转语音

```yaml
### TTS 相关配置
azure_tts_subscription_key: 'YOUR_API_KEY'
azure_tts_region: 'eastus'
```

## Mermaid 图表

查看 [mermaid_config.py](https://github.com/geekan/MetaGPT/blob/main/metagpt/configs/mermaid_config.py) 获取更多详情。

```yaml
mermaid:
  engine: 'nodejs' # nodejs/ink/playwright/pyppeteer
  path: 'mmdc' # 例如 './node_modules/.bin/mmdc'
  puppeteer_config: './config/puppeteer-config' # 仅适用于 nodejs
  pyppeteer_path: '/usr/bin/google-chrome-stable' # 仅适用于 pyppeteer
```
