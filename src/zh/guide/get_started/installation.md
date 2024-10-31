# 安装

我们提供了几种安装MetaGPT的方式，请选择最适合你的方式。

## 支持的系统和版本

| 系统版本     | Python版本 | 是否支持 |
| ------------ | ---------- | -------- |
| macOS 13.x   | python 3.9 | 是       |
| Windows 11   | python 3.9 | 是       |
| Ubuntu 22.04 | python 3.9 | 是       |

请确保你的系统已安装Python 3.9+。你可以通过以下命令进行检查：

```
python3 --version
```

## 安装稳定版本

推荐大多数用户使用。你可以像使用任何python包一样导入MetaGPT，使用各种内置角色或团队，并构建自己的智能体来服务各种应用。

```
pip install metagpt
```

### 安装子模块

- RAG, `pip install 'metagpt[rag]'`.
  用途：用于基于 RAG（Retrieval-Augmented Generation，检索增强生成）的系统，结合多个 LLM（大语言模型）和向量存储技术。
- OCR, `pip install 'metagpt[ocr]'`.
  用途：用于光学字符识别（OCR）任务，识别和提取图像中的文本。
- search-ddg, `pip install 'metagpt[search-ddg]'`.
  用途：用于 DuckDuckGo 搜索功能。
- search-google, `pip install 'metagpt[search-google]'`.
  用途：用于与 Google API（如 Google 搜索 API）进行交互。
- selenium, `pip install 'metagpt[selenium]'`.
  用途：用于自动化浏览器操作和网页抓取。

## 安装最新的开发版本

最适合体验最新功能的用户。

```
pip install git+https://github.com/geekan/MetaGPT
```

## 以开发模式安装

推荐给那些想要根据自己的独特需求定制框架、尝试新的想法或者利用框架创建复杂功能（如新颖的记忆机制）的开发者和研究者。

```
git clone https://github.com/geekan/MetaGPT.git
cd /your/path/to/MetaGPT
pip install -e .
```

## 安装子模块

- RAG，`pip install -e .[rag]`

## 使用Docker安装

### 使用默认的MetaGPT镜像

```bash
# 第1步：下载metagpt官方镜像并准备config2.yaml
docker pull metagpt/metagpt:latest
mkdir -p /opt/metagpt/{config,workspace}
docker run --rm metagpt/metagpt:latest cat /app/metagpt/config/config2.yaml > /opt/metagpt/config/config2.yaml
vim /opt/metagpt/config/config2.yaml # 修改配置

# 第2步：使用容器运行metagpt demo
docker run --rm \
    --privileged \
    -v /opt/metagpt/config/config2.yaml:/app/metagpt/config/config2.yaml \
    -v /opt/metagpt/workspace:/app/metagpt/workspace \
    metagpt/metagpt:latest \
    metagpt "Write a cli snake game"

# 你也可以启动一个容器并在其中执行命令
docker run --name metagpt -d \
    --privileged \
    -v /opt/metagpt/config/config2.yaml:/app/metagpt/config/config2.yaml \
    -v /opt/metagpt/workspace:/app/metagpt/workspace \
    metagpt/metagpt:latest

docker exec -it metagpt /bin/bash
$ metagpt "Write a cli snake game"
```

`docker run ...`命令做了以下事情：

- 以特权模式运行，以获得运行浏览器的权限
- 将主机配置文件`/opt/metagpt/config/config2.yaml`映射到容器`/app/metagpt/config/config2.yaml`
- 将主机目录`/opt/metagpt/workspace`映射到容器`/app/metagpt/workspace`
- 执行demo命令`metagpt "Write a cli snake game"`

### 自行构建镜像

```bash
# 你也可以自行构建metagpt镜像。
git clone https://github.com/geekan/MetaGPT.git
cd MetaGPT && docker build -t metagpt:custom .
```

## 安装全部功能

如果你想生成一些图表，比如象限图，系统设计图，顺序流程图等，这非常有用。如果你运行[软件启动示例](https://github.com/geekan/MetaGPT/blob/main/metagpt/software_company.py)，它们将作为中间结果提供给你。

### Mermaid

Mermaid是一种使用文本生成流程图、饼图、甘特图和其他图表的语言。MetaGPT使用Mermaid创建流程图、序列图和甘特图等图表。Mermaid是在Node.js中实现的，直接安装可能有些昂贵。MetaGPT提供以下Mermaid引擎将Mermaid文本转换为图表：

**nodejs**
通过nodejs直接安装mermaid-cli。MetaGPT调用命令行将Mermaid文本转换为图表。你需要先安装nodejs，然后使用npm进行安装：

```
npm install -g @mermaid-js/mermaid-cli
```

这是mermaid提供的官方方法，通过nodejs安装，因此它基本上支持所有平台，也支持输出png/svg/pdf格式。然而，它需要安装nodejs和mermaid-cli，安装和使用有一定的成本，并且在运行时需要浏览器环境。

**pyppeteer**
Mermaid也可以通过JavaScript调用，pyppeteer是一个用Python实现的web自动化测试工具，可以执行JavaScript脚本。因此，使用pyppeteer + mermaidjs可以将Mermaid文本转换为图表。你可以使用pip安装pyppeteer：

```
pip install pyppeteer
```

这种方法安装相对简单，没有平台限制，并支持输出png/svg/pdf格式。然而，它需要依赖于浏览器，所以你需要先安装一个浏览器，并在运行时设置浏览器路径：

```
export PUPPETEER_EXECUTABLE_PATH=/path/to/your/chromium  # 或者edge或chrome
```

（注意：pyppeteer已经不再维护）

**playwright**
由于pyppeteer已经不再维护，它推荐使用playwright-python作为替代。使用playwright运行mermaid的原理与pyppeteer相同。然而，playwright-python需要安装其自己提供的浏览器，不能使用已经安装的浏览器。官方只支持以下平台：

- Windows 10+，Windows Server 2016+或Windows Subsystem for Linux (WSL)。
- MacOS 12 Monterey或MacOS 13 Ventura。
- Debian 11，Debian 12，Ubuntu 20.04或Ubuntu 22.04。

```
pip install playwright
playwright install --with-deps chromium
```

**ink**
Mermaid.ink 项目提供了将 Mermaid 文本在线转换为图表的功能，请参阅 [Mermaid.ink](https://mermaid.ink/)。因此，任何连接到互联网的设备都可以使用ink方法，而无需本地浏览器或其他依赖关系。然而，此方法仅支持生成 PNG 和 SVG，不支持 PDF，并且在操作过程中需要访问 [Mermaid.ink](https://mermaid.ink/)，可能会受到网络和其他因素的影响，可能导致稳定性受到影响。

对比
| Mermaid引擎 | nodejs | pyppeteer | playwright | ink |
| -------------- | ------ | --------- | ---------- | --- |
| 安装简易度 | ★ | ★★★ | ★★ | ★★★★★ |
| 平台兼容性 | ★★★★★ | ★★★★ | ★★★ | ★★★★★ |
| 生成png | ✔ | ✔ | ✔ | ✔ |
| 生成svg | ✔ | ✔ | ✔ | ✔ |
| 生成pdf | ✔ | ✔ | ✔ | ✘ |
| 离线运行 | ✔ | ✔ | ✔ | ✘ |

- **安装简易度**：星级越多表示安装难度越低。
