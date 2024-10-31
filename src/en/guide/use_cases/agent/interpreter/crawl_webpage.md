# Tool Usage: Web Scraping

## Overview

Web scraping involves the extraction and understanding of web page content, providing users with more intelligent, customized information retrieval and analysis capabilities. We will implement this scenario requirement with `DataInterpreter`.

## Example: Using the Tool to Obtain Table Data from a Static Web Page

### Task

Retrieve paper information containing the keywords: `multiagent` and `large language model` from [iclr-2024-statistics](https://papercopilot.com/statistics/iclr-statistics/iclr-2024-statistics/)

### Code

[examples/di/crawl_webpage.py](https://github.com/geekan/MetaGPT/blob/main/examples/di/crawl_webpage.py)

```bash
python examples/di/crawl_webpage.py
```

### Execution Results

<br>
<video  controls>
  <source src="/image/guide/use_cases/interpreter/paper_list2.mp4" type="video/mp4">
</video>

<br>
<img src="../../../../../public/image/guide/use_cases/interpreter/iclr2024_filtered_papers.png">

## Mechanism Explained

1. Use the tool function scrape_web_playwright from metagpt.tools.libs.web_scraping to obtain the webpage's HTML and inner text. This tool function is a wrapper for the browser automation library Playwright.
2. Use BeautifulSoup to retrieve the table with the id paperlist, and load it as a pandas DataFrame.
3. Obtain the column names of the DataFrame to locate the title column, match keywords multiagent, large language model to filter data. Save the filtered data in filtered_papers.csv.
