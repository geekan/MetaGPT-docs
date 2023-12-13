# 配置

MetaGPT的使用涉及到不同模型提供商的访问配置，我们将在本页中详细介绍该设置。

## 配置LLM API

我们将使用OpenAI API作为例子。你可以通过下述方式完成配置：

1. 使用环境变量，这是推荐的最快捷的方式。
2. 使用config或key配置文件，这是推荐的进行完整功能体验和开发的方式。

### 1. 使用环境变量

在命令行下执行：

```shell
export OPENAI_API_KEY="sk-..."  # YOUR_API_KEY
export OPENAI_API_MODEL="intended model" # gpt-4, gpt-3.5-turbo, etc.
```

或者在python代码中添加：

```python
import os
os.environ["OPENAI_API_KEY"] = "sk-..."  # YOUR_API_KEY
os.environ["OPENAI_API_MODEL"] = "intended model" # gpt-4, gpt-3.5-turbo, etc.
```

### 2. 使用一个`config.yaml`或者`key.yaml`文件

1. 在当前项目的工作目录下，新建一个文件夹`config`并在该文件夹下添加一个`config.yaml`或`key.yaml`文件
2. 拷贝样例配置 [config.yaml](https://github.com/geekan/MetaGPT/blob/main/config/config.yaml) 中的内容到你的新文件中。
3. 在新文件内设置自己的OPENAI API KEY配置：

```yaml
OPENAI_API_KEY: 'sk-...' # YOUR_API_KEY
OPENAI_API_MODEL: 'intended model' # gpt-4, gpt-3.5-turbo, etc.
```

记住：如果你按照 [安装](./installation) 使用`git clone`的方法进行安装，`config/config.yaml`已经存在于目录中。只需要直接进行配置，或拷贝一个新文件 `config/key.yaml` 并进行配置。 这样你就不会因为不小心提交了API KEYT而导致泄露。

> 注意：
> MetaGPT将会按照下述优先级来读取你的配置：`config/key.yaml > config/config.yaml > environment variable`

现在你可以开始使用了！参考 [快速开始](./quickstart) 或 [教程](/guide/tutorials/agent_101) 进行第一个软件项目的生成。

## 不同模型提供商的配置

### OpenAI

### Azure

### Anthropic

## 其他API的配置
