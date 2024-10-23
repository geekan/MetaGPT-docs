# Helicone

Connecting Helicone is straightforward and easy. With Helicone you can get rich usage dashboards, and track your agents.

Simply change your `config.yaml` to point base_url to the corresponding base_url for your provider, using one of [Helicone's gateway URLs](https://docs.helicone.ai/getting-started/integration-method/gateway).

For OpenAI:

```yaml
llm:
  api_type: 'openai'
  model: 'gpt-4-turbo' # or gpt-3.5-turbo
  base_url: 'https://oai.helicone.ai/{HELICONE_API_KEY}/v1'
  api_key: 'YOUR_API_KEY'
```

See [Helicone's docs](https://docs.helcione.ai/other-integrations/meta-gpt) for the most up to date information.
