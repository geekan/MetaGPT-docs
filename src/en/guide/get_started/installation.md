# Installation

We provide several ways for installing MetaGPT, please take the one most convenient to your case.

## Support system and version

| System Version | Python Version | Supported |
| -------------- | -------------- | --------- |
| macOS 13.x     | python 3.9     | Yes       |
| Windows 11     | python 3.9     | Yes       |
| Ubuntu 22.04   | python 3.9     | Yes       |

Ensure that Python 3.9+ is installed on your system. You can check this by using:

```
python3 --version
```

## Install stable version

Recommended for most users. You can import MetaGPT like any python package, employ teams of diverse built-in roles, and build your own agents to serve all kinds of application.

```
pip install metagpt
```

### Install submodules

- RAG, `pip install 'metagpt[rag]'`.
  Purpose: Used in systems based on RAG (Retrieval-Augmented Generation), combining multiple LLM (Large Language Model) and vector storage technologies.
- OCR, `pip install 'metagpt[ocr]'`.
  Purpose: For optical character recognition (OCR) tasks, identifying and extracting text from images.
- search-ddg, `pip install 'metagpt[search-ddg]'`.
  Purpose: Used in the DuckDuckGo search function.
- search-google, `pip install 'metagpt[search-google]'`.
  Purpose: Used to interact with Google APIs (such as the Google Search API).
- selenium, `pip install 'metagpt[selenium]'`.
  Purpose: Used to automate browser operations and web scraping.

## Install latest development version

Best for experiencing newest features.

```
pip install git+https://github.com/geekan/MetaGPT
```

## Install in development mode

Recommended for developers and researchers looking to customize the framework for their unique requirements, experiment on new ideas, or create sophisticated functionalities like a novel memory mechanism using the framework.

```
git clone https://github.com/geekan/MetaGPT.git
cd ./MetaGPT
pip install -e .
```

### Install submodules

- RAG, `pip install -e .[rag]`

## Install with Docker

### Use default MetaGPT image

```bash
# Step 1: Download metagpt official image and prepare config2.yaml
docker pull metagpt/metagpt:latest
mkdir -p /opt/metagpt/{config,workspace}
docker run --rm metagpt/metagpt:latest cat /app/metagpt/config/config2.yaml > /opt/metagpt/config/config2.yaml
vim /opt/metagpt/config/config2.yaml # Change the config

# Step 2: Run metagpt demo with container
docker run --rm \
    --privileged \
    -v /opt/metagpt/config/config2.yaml:/app/metagpt/config/config2.yaml \
    -v /opt/metagpt/workspace:/app/metagpt/workspace \
    metagpt/metagpt:latest \
    metagpt "Write a cli snake game"

# You can also start a container and execute commands in it
docker run --name metagpt -d \
    --privileged \
    -v /opt/metagpt/config/config2.yaml:/app/metagpt/config/config2.yaml \
    -v /opt/metagpt/workspace:/app/metagpt/workspace \
    metagpt/metagpt:latest

docker exec -it metagpt /bin/bash
$ metagpt "Write a cli snake game"
```

The command `docker run ...` do the following things:

- Run in privileged mode to have permission to run the browser
- Map host configure file `/opt/metagpt/config/config2.yaml` to container `/app/metagpt/config/config2.yaml`
- Map host directory `/opt/metagpt/workspace` to container `/app/metagpt/workspace`
- Execute the demo command `metagpt "Write a cli snake game"`

### Build image by yourself

```bash
# You can also build metagpt image by yourself.
git clone https://github.com/geekan/MetaGPT.git
cd MetaGPT && docker build -t metagpt:custom .
```

## Installation for full features

This is relevant if you want to generate diagrams such as quadrant chart, system designs, sequence flow, etc. They are provided as intermediate results if you run the [software startup example](https://github.com/geekan/MetaGPT/blob/main/metagpt/software_company.py).

### Mermaid

Mermaid is a language that uses text to generate flowcharts, pie charts, Gantt charts, and other diagrams. MetaGPT uses Mermaid to create flowcharts, sequence diagrams, Gantt charts, etc. Mermaid is implemented in Node.js, and direct installation can be somewhat costly. MetaGPT provides the following Mermaid Engines to convert Mermaid text into diagrams:

**nodejs**
Install mermaid-cli directly through nodejs. MetaGPT calls the command line to turn Mermaid text into diagrams. You need to install nodejs first, then use npm to install:

```
npm install -g @mermaid-js/mermaid-cli
```

The official method provided by mermaid, installed via nodejs, thus it basically supports all platforms and also supports output in png/svg/pdf formats. However, it requires the installation of nodejs and mermaid-cli, which comes with certain costs for installation and use, and also requires a browser environment at runtime.

**pyppeteer**
Mermaid can also be called via JavaScript, and pyppeteer is a web automation testing tool implemented in Python that can execute JavaScript scripts. Therefore, using pyppeteer + mermaidjs can convert Mermaid text into diagrams. You can install pyppeteer with pip:

```
pip install pyppeteer
```

This method is relatively simple to install, has no platform restrictions, and supports output in png/svg/pdf formats. However, it requires a dependency on a browser, so you need to install a browser first and set the browser path when running:

```
export PUPPETEER_EXECUTABLE_PATH=/path/to/your/chromium  # or edge or chrome
```

(Note: pyppeteer is no longer maintained)

**playwright**
As pyppeteer is no longer maintained, it recommends using playwright-python as a replacement. The principle of running mermaid with playwright is the same as with pyppeteer. However, playwright-python requires the installation of its own provided browser and cannot use an already installed browser. The official only supports the following platforms:

- Windows 10+, Windows Server 2016+ or Windows Subsystem for Linux (WSL).
- MacOS 12 Monterey or MacOS 13 Ventura.
- Debian 11, Debian 12, Ubuntu 20.04 or Ubuntu 22.04.

```
pip install playwright
playwright install --with-deps chromium
```

**ink**
The mermaid.ink project provides the function to convert Mermaid text into diagrams online, refer to https://mermaid.ink/. Thus, any internet-connected device can use ink method without the need for a local browser or other dependencies. However, this method only supports generating png and svg, not pdf, and requires access to https://mermaid.ink/ during operation, so it may be affected by the network and other factors, possibly impacting stability.

Comparison
| Mermaid Engine | nodejs | pyppeteer | playwright | ink |
| -------------- | ------ | --------- | ---------- | --- |
| Installation Simplicity | ★ | ★★★ | ★★ | ★★★★★ |
| Platform Compatibility | ★★★★★ | ★★★★ | ★★★ | ★★★★★ |
| Generates png | ✔ | ✔ | ✔ | ✔ |
| Generates svg | ✔ | ✔ | ✔ | ✔ |
| Generates pdf | ✔ | ✔ | ✔ | ✘ |
| Offline Running | ✔ | ✔ | ✔ | ✘ |

- **Installation Simplicity**: The more stars, the lower the difficulty of installation.
