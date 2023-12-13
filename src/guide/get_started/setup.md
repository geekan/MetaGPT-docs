# Setup

Using MetaGPT involves connecting with model providers. We will walk through the setup in this page.

## Setup for LLM API

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
os.environ["OPENAI_API_MODEL"] = "intended model" # gpt-4, gpt-3.5-turbo, etc.
```

### 2. Use a config or key file

1. In your current working directory, create a folder `config` and add a new file named `config.yaml` or `key.yaml` under it.
2. Copy the content from the example [config.yaml](https://github.com/geekan/MetaGPT/blob/main/config/config.yaml) file into your new files
3. Fill in your own values to the file:

```yaml
OPENAI_API_KEY: 'sk-...' # YOUR_API_KEY
OPENAI_API_MODEL: 'intended model' # gpt-4, gpt-3.5-turbo, etc.
```

Remember: If you follow the `git clone` approach in [Installation](./installation), `config/config.yaml` will already be there. Just edit it or make a copy named `config/key.yaml` for editting. This way you don't accidentally commit and share your API key using git.

> Note:
> MetaGPT will read your setup in this priority order: `config/key.yaml > config/config.yaml > environment variable`

Here you are good to go! See [Quickstart](./quickstart) or our [Tutorials](/guide/tutorials/agent_101) for your first run!

## Setup for different model providers

### OpenAI

### Azure

### Anthropic

## Setup for other APIs
