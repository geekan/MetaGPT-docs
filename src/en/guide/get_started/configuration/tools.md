# Configuration for tools (Optional)

In addition to LLM, we often want agents to use tools. We cover their setup in this section.

## Web searching API

Check [search_config.py](https://github.com/geekan/MetaGPT/blob/main/metagpt/configs/search_config.py)

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
  params:
    engine: google # google/bing/yahoo/baidu/yandex, check https://serpapi.com/bing-search-api for more details
    google_domain: 'google.com'
    gl: us
    hl: en
```

## Web browsing

Check [browser_config.py](https://github.com/geekan/MetaGPT/blob/main/metagpt/configs/browser_config.py)

```yaml
browser:
  engine: 'playwright' # playwright/selenium
  # for playwright engine, please check https://playwright.dev/python/docs/api/class-browsertype
  # for selenium engine, please check https://www.selenium.dev/documentation/webdriver/browsers
  browser_type: 'chrome' # playwright: chromium/firefox/webkit; selenium: chrome/firefox/edge/ie
```

## Azure TTS

```yaml
### for TTS
azure_tts_subscription_key: 'YOUR_API_KEY'
azure_tts_region: 'eastus'
```

## Mermaid

Check [mermaid_config.py](https://github.com/geekan/MetaGPT/blob/main/metagpt/configs/mermaid_config.py)

```yaml
mermaid:
  engine: 'nodejs' # nodejs/ink/playwright/pyppeteer
  path: 'mmdc' # such as './node_modules/.bin/mmdc'
  puppeteer_config: './config/puppeteer-config' # only for nodejs
  pyppeteer_path: '/usr/bin/google-chrome-stable' # only for pyppeteer
```
