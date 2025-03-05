# 设置

使用MetaGPT需要配置模型API。我们将在本页面中介绍设置过程。

在[安装](./installation.md)完成后，请按照本文档中的说明完成配置，然后开始使用。
目前，该项目的示例只需要配置OpenAI API。

## [配置大模型API](./configuration/llm_api_configuration.md)

## [配置工具（可选）](./configuration/tools.md)

## 其他配置（可选）

请查看 [config2.example.yaml](https://github.com/geekan/MetaGPT/blob/main/config/config2.example.yaml) 和
[config2.py](https://github.com/geekan/MetaGPT/blob/main/metagpt/config2.py) 获取完整配置参考。

```yaml
enable_longterm_memory: false  # 是否启用长期记忆
prompt_schema: json # 提示词格式（json 或 markdown）
```
