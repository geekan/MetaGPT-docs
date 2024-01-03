# Getting Started

## Installation

### Installation Video Guide

- [Matthew Berman: How To Install MetaGPT - Build A Startup With One Prompt!!](https://youtu.be/uT75J_KG_aY)

### Traditional Installation

```bash
# Step 1: Ensure that NPM is installed on your system. Then install mermaid-js. (If you don't have npm in your computer, please go to the Node.js official website to install Node.js https://nodejs.org/ and then you will have npm tool in your computer.)
npm --version
sudo npm install -g @mermaid-js/mermaid-cli

# Step 2: Ensure that Python 3.9+ is installed on your system. You can check this by using:
python3 --version

# Step 3: Clone the repository to your local machine, and install it.
git clone https://github.com/geekan/metagpt
cd metagpt
pip install -e.
```

**Note:**

- If already have Chrome, Chromium, or MS Edge installed, you can skip downloading Chromium by setting the environment variable
  `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` to `true`.

- Some people are [having issues](https://github.com/mermaidjs/mermaid.cli/issues/15) installing this tool globally. Installing it locally is an alternative solution,

  ```bash
  npm install @mermaid-js/mermaid-cli
  ```

- don't forget to the configuration for mmdc in config.yml

  ```yml
  PUPPETEER_CONFIG: './config/puppeteer-config.json'
  MMDC: './node_modules/.bin/mmdc'
  ```

- if `pip install -e.` fails with error `[Errno 13] Permission denied: '/usr/local/lib/python3.11/dist-packages/test-easy-install-13129.write-test'`, try instead running `pip install -e. --user`

- To convert Mermaid charts to SVG, PNG, and PDF formats. In addition to the Node.js version of Mermaid-CLI, you now have the option to use Python version Playwright, pyppeteer or mermaid.ink for this task.

  - Playwright

    - **Install Playwright**

    ```bash
    pip install playwright
    ```

    - **Install the Required Browsers**

    to support PDF conversion, please install Chrominum.

    ```bash
    playwright install --with-deps chromium
    ```

    - **modify `config.yaml`**

    uncomment MERMAID_ENGINE from config.yaml and change it to `playwright`

    ```yaml
    MERMAID_ENGINE: playwright
    ```

  - pyppeteer

    - **Install pyppeteer**

    ```bash
    pip install pyppeteer
    ```

    - **Use your own Browsers**

    pyppeteer allows you use installed browsers, please set the following envirment

    ```bash
    export PUPPETEER_EXECUTABLE_PATH = /path/to/your/chromium or edge or chrome
    ```

    please do not use this command to install browser, it is too old

    ```bash
    pyppeteer-install
    ```

    - **modify `config.yaml`**

    uncomment MERMAID_ENGINE from config.yaml and change it to `pyppeteer`

    ```yaml
    MERMAID_ENGINE: pyppeteer
    ```

  - mermaid.ink

    - **modify `config.yaml`**

    uncomment MERMAID_ENGINE from config.yaml and change it to `ink`

    ```yaml
    MERMAID_ENGINE: ink
    ```

    Note: this method does not support pdf export.

### Installation by Docker

```bash
# Step 1: Download metagpt official image and prepare config.yaml
docker pull metagpt/metagpt:latest
mkdir -p /opt/metagpt/{config,workspace}
docker run --rm metagpt/metagpt:latest cat /app/metagpt/config/config.yaml > /opt/metagpt/config/key.yaml
vim /opt/metagpt/config/key.yaml # Change the config

# Step 2: Run metagpt demo with container
docker run --rm \
    --privileged \
    -v /opt/metagpt/config/key.yaml:/app/metagpt/config/key.yaml \
    -v /opt/metagpt/workspace:/app/metagpt/workspace \
    metagpt/metagpt:latest \
    metagpt "Write a cli snake game"

# You can also start a container and execute commands in it
docker run --name metagpt -d \
    --privileged \
    -v /opt/metagpt/config/key.yaml:/app/metagpt/config/key.yaml \
    -v /opt/metagpt/workspace:/app/metagpt/workspace \
    metagpt/metagpt:latest

docker exec -it metagpt /bin/bash
$ metagpt "Write a cli snake game"
```

The command `docker run ...` do the following things:

- Run in privileged mode to have permission to run the browser
- Map host configure file `/opt/metagpt/config/key.yaml` to container `/app/metagpt/config/key.yaml`
- Map host directory `/opt/metagpt/workspace` to container `/app/metagpt/workspace`
- Execute the demo command `metagpt "Write a cli snake game"`

### Build image by yourself

```bash
# You can also build metagpt image by yourself.
git clone https://github.com/geekan/MetaGPT.git
cd MetaGPT && docker build -t metagpt:custom .
```

## Configuration

- Configure your `OPENAI_API_KEY` in any of `config/key.yaml / config/config.yaml / env`
- Priority order: `config/key.yaml > config/config.yaml > env`

```bash
# Copy the configuration file and make the necessary modifications.
cp config/config.yaml config/key.yaml
```

| Variable Name                              | config/key.yaml                           | env                                             |
| ------------------------------------------ | ----------------------------------------- | ----------------------------------------------- |
| OPENAI_API_KEY # Replace with your own key | OPENAI_API_KEY: "sk-..."                  | export OPENAI_API_KEY="sk-..."                  |
| OPENAI_BASE_URL # Optional                 | OPENAI_BASE_URL: "https://<YOUR_SITE>/v1" | export OPENAI_BASE_URL="https://<YOUR_SITE>/v1" |

## Tutorial: Initiating a startup

```shell
# Run the script
metagpt "Write a cli snake game"
# Do not hire an engineer to implement the project
metagpt "Write a cli snake game" --no-implement
# Hire an engineer and perform code reviews
metagpt "Write a cli snake game" --code_review
```

After running the script, you can find your new project in the `workspace/` directory.

### Preference of Platform or Tool

You can tell which platform or tool you want to use when stating your requirements.

```shell
metagpt "Write a cli snake game based on pygame"
```

### Usage

```
 Usage: metagpt [OPTIONS] IDEA

 Run a startup. Be a boss.

╭─ Arguments ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ *    idea      TEXT  Your innovative idea, such as 'Create a 2048 game.' [default: None] [required]                                                                                                                    │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭─ Options ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ --investment                                     FLOAT                            Dollar amount to invest in the AI company. [default: 3.0]                                                                            │
│ --n-round                                        INTEGER                          Number of rounds for the simulation. [default: 5]                                                                                    │
│ --code-review                --no-code-review                                     Whether to use code review. [default: code-review]                                                                                   │
│ --run-tests                  --no-run-tests                                       Whether to enable QA for adding & running tests. [default: no-run-tests]                                                             │
│ --implement                  --no-implement                                       Enable or disable code implementation. [default: implement]                                                                          │
│ --project-name                                   TEXT                             Unique project name, such as 'game_2048'.                                                                                            │
│ --inc                        --no-inc                                             Incremental mode. Use it to coop with existing repo. [default: no-inc]                                                               │
│ --project-path                                   TEXT                             Specify the directory path of the old version project to fulfill the incremental requirements.                                       │
│ --reqa-file                                      TEXT                             Specify the source file name for rewriting the quality test code.                                                                    │
│ --max-auto-summarize-code                        INTEGER                          The maximum number of times the 'SummarizeCode' action is automatically invoked, with -1 indicating unlimited. This parameter is     │
│                                                                                   used for debugging the workflow.                                                                                                     │
│                                                                                   [default: -1]                                                                                                                        │
│ --install-completion                             [bash|zsh|fish|powershell|pwsh]  Install completion for the specified shell. [default: None]                                                                          │
│ --show-completion                                [bash|zsh|fish|powershell|pwsh]  Show completion for the specified shell, to copy it or customize the installation. [default: None]                                   │
│ --help                                                                            Show this message and exit.                                                                                                          │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

You can check `examples` for more details on single role (with knowledge base) and LLM only examples.

## QuickStart

It is difficult to install and configure the local environment for some users. The following tutorials will allow you to quickly experience the charm of MetaGPT.

- [MetaGPT quickstart](https://deepwisdom.feishu.cn/wiki/CyY9wdJc4iNqArku3Lncl4v8n2b)

Try it on Huggingface Space

- https://huggingface.co/spaces/deepwisdom/MetaGPT

## Citation

For now, cite the [arXiv paper](https://arxiv.org/abs/2308.00352):

```bibtex
@misc{hong2023metagpt,
      title={MetaGPT: Meta Programming for Multi-Agent Collaborative Framework},
      author={Sirui Hong and Xiawu Zheng and Jonathan Chen and Yuheng Cheng and Jinlin Wang and Ceyao Zhang and Zili Wang and Steven Ka Shing Yau and Zijuan Lin and Liyang Zhou and Chenyu Ran and Lingfeng Xiao and Chenglin Wu},
      year={2023},
      eprint={2308.00352},
      archivePrefix={arXiv},
      primaryClass={cs.AI}
}
```

## Contact Information

If you have any questions or feedback about this project, please feel free to contact us. We highly appreciate your suggestions!

- **Email:** alexanderwu@deepwisdom.ai
- **GitHub Issues:** For more technical inquiries, you can also create a new issue in our [GitHub repository](https://github.com/geekan/metagpt/issues).

We will respond to all questions within 2-3 business days.

## Demo

<video  controls>
  <source src="https://github.com/geekan/MetaGPT/assets/2707039/5e8c1062-8c35-440f-bb20-2b0320f8d27d" type="video/mp4">
</video>
