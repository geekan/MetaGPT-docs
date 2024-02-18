# Tool Usage: Web Scraping

## Overview

Web scraping involves the extraction and understanding of web page content, providing users with more intelligent, customized information retrieval and analysis capabilities. We will implement this scenario requirement with Interpreter.

## Example: Using the Tool to Obtain Table Data from a Static Web Page

### Task

Retrieve paper information containing the keywords: `multiagent` and `large language model` from [iclr-2024-statistics](https://papercopilot.com/statistics/iclr-statistics/iclr-2024-statistics/)

### Code

```bash
python examples/mi/crawl_webpage.py
```

### Execution Results

## Mechanism Explained

1. Use the tool function scrape_web_playwright from metagpt.tools.libs.web_scraping to obtain the webpage's HTML and inner text. This tool function is a wrapper for the browser automation library Playwright.
2. Use BeautifulSoup to retrieve the table with the id paperlist, and load it as a pandas DataFrame.
3. Obtain the column names of the DataFrame to locate the title column, match keywords multiagent, large language model to filter data. Save the filtered data in filtered_iclr_2024_papers.csv.
