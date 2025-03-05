# Helicone

连接Helicone的过程简单直接。通过Helicone，您可以获得丰富的使用情况仪表板，并跟踪您的智能体。

只需将您的`config.yaml`文件中的base_url修改为对应服务提供商的[Helicone网关URL](https://docs.helicone.ai/getting-started/integration-method/gateway)即可。

针对OpenAI的配置示例：

```yaml
llm:
  api_type: 'openai'
  model: 'gpt-4-turbo' # 或 gpt-3.5-turbo
  base_url: 'https://oai.helicone.ai/{HELICONE_API_KEY}/v1'
  api_key: '您的API密钥'
```

请参阅[Helicone官方文档](https://docs.helcione.ai/other-integrations/meta-gpt)获取最新配置信息。