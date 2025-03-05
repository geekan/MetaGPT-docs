# MetaGPT-Index / 常见问题解答（FAQ）

> 我们的愿景有二：[一是让人类活的更久](https://github.com/geekan/HowToLiveLonger)， [二是让人类花更少时间工作](https://github.com/geekan/MetaGPT/)

### 分享本文档使用文本

```
https://docs.deepwisdom.ai/main/en/guide/faq.html
https://docs.deepwisdom.ai/main/zh/guide/faq.html
```

### 链接

1. 代码：https://github.com/geekan/MetaGPT
2. 任务：https://github.com/geekan/MetaGPT/blob/main/docs/ROADMAP.md
3. 英文
   1. Demo Video: [MetaGPT: Multi-Agent AI Programming Framework](https://www.youtube.com/watch?v=8RNzxZBTW8M)
   2. Tutorial: [MetaGPT: Deploy POWERFUL Autonomous Ai Agents BETTER Than SUPERAGI!](https://www.youtube.com/watch?v=q16Gi9pTG_M&t=659s)
   3. Author's thoughts video(EN): [MetaGPT Matthew Berman](https://youtu.be/uT75J_KG_aY?si=EgbfQNAwD8F5Y1Ak)
4. 中文
   1. Demo 视频: [MetaGPT：一行代码搭建你的虚拟公司\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1NP411C7GW/?spm_id_from=333.999.0.0&vd_source=735773c218b47da1b4bd1b98a33c5c77)
   1. 思路教程: [一个提示词写游戏 Flappy bird, 比AutoGPT强10倍的MetaGPT，最接近AGI的AI项目](https://youtu.be/Bp95b8yIH5c)
   1. 作者想法视频: [MetaGPT作者深度解析直播回放\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1Ru411V7XL/?spm_id_from=333.337.search-card.all.click)
5. 快速体验：[MetaGPT快速体验](https://deepwisdom.feishu.cn/wiki/Q8ycw6J9tiNXdHk66MRcIN8Pnlg)

### 如何成为贡献者？

1. 在Roadmap中选择一个任务（或者也可以自己propose），提交一个PR可以成为贡献者，加入dev团队
2. 目前贡献者有 字节ailab / 叮咚 / 滴滴 / 小红书 / 腾讯 / 百度 / MSRA / TikTok / bloomgpt infra / bilibili / CUHK / 港科 / CMU / UCB 等背景

### 首席布道师（单月轮值）

MetaGPT社区-首席布道师 单月轮值，主要职责如下

1. 维护社区FAQ文档、公告、Github资源/README
2. 在平均30分钟内响应、回答、分发社区的问题（包括Github Issues、微信、Discord）
3. 维护整体社区的氛围热情、真诚、友善
4. 鼓励大家成为贡献者，一起参与到最接近AGI的工程
5. （可选）举办小型活动，如hackathon

### FAQ

1. **已经生成的repo代码体验**

   - https://github.com/geekan/MetaGPT/releases/tag/v0.1.0 里有少量

2. **代码截断 / 解析失败**

   - 看下是否是因为超长的问题，考虑使用gpt-3.5-turbo-16k或者其他的长token版本

3. **成功概率**

   - 目前还没有量化统计，但是GPT-4生成的代码成功率显著比gpt-3.5-turbo要高

4. **是否支持增量、差量更新（干到一半，希望继续）**

   - 已支持，详看https://docs.deepwisdom.ai/main/en/guide/in_depth_guides/incremental_development.html

5. **是否支持已有代码加载？**

   - 还没在ROADMAP上，但有方案，需要时间

6. **是否支持多编程语言、多自然语言？**

   - 在[ROADMAP](https://github.com/geekan/MetaGPT/blob/main/docs/ROADMAP.md)上，已支持

7. **想加入贡献者团队，怎么做?**

   - 合入一个PR就可以加入贡献者团队。目前主要在做的工作都在[ROADMAP](https://github.com/geekan/MetaGPT/blob/main/docs/ROADMAP.md)上

8. **PRD卡住 / 无法访问 / 连接中断**

   - OPENAI_API_BASE 官方地址为 `https://api.openai.com/v1`
   - 如果自己的环境中 OPENAI_API_BASE 官方地址不可访问（可以通过curl验证），那么建议配置使用 [openai-forward](https://github.com/beidongjiedeguang/openai-forward) 等库给出的反向代理 OPENAI_API_BASE，例如 `OPENAI_API_BASE: https://api.openai-forward.com/v1`
   - 如果自己的环境中 OPENAI_API_BASE 官方地址不可访问（可以通过curl验证），还有一种可选的办法是配置 OPENAI_PROXY 参数，这样就可以通过本地代理来访问官方的OPENAI_API_BASE。如果不需要通过代理访问，请不要开启这个配置；如果需要通过代理访问，请把它改成你的正确的代理地址。注意，开启 OPENAI_PROXY 时，不要设置 OPENAI_API_BASE
   - 注意：OpenAI的默认API设计尾部会有个v1，正确配置示例： `OPENAI_API_BASE: "``https://api.openai.com/v1``"`
   - 网络问题始终解决不了的同学，建议使用云端环境，参考 [MetaGPT快速体验](https://deepwisdom.feishu.cn/wiki/Q8ycw6J9tiNXdHk66MRcIN8Pnlg)

9. **是否使用了Chi或者类似的服务？**

   - 是否使用了Chi或者类似的服务？这些服务有概率出错，目测在GPT-4 3.5k-4k token消耗时出错概率高

10. **Max token是什么意思？**

    - 这是OpenAI的回复最大长度配置，超过max token会截断回复

11. **怎么改投资金额**

    - 指定 `--investment` 参数
    - `python  {startup.py}  --help` 可以查看所有命令

12. **python版本哪个比较稳定**

    - python3.9 / python3.10

13. **用不了GPT-4，提示模型不存在 The model gpt-4 does not exist**

    - OpenAI官方要求：在OpenAI消费1美元之后才能用GPT-4
    - 经验：用gpt-3.5-turbo跑点数据（消费完免费额度与1美元），就可以用gpt-4了

14. **没见过代码的游戏能不能写？**

    - 参考README，头条推荐系统是目前世界上复杂度最高的系统之一，它不存在于github，但很多小的讨论在互联网中存在，它能画出来，意味着它可以总结这些讨论，并翻译为代码。提示词就是“写一个类似今日头条的推荐系统”（这个是在更早一些的版本做的。更早一些的版本SOP有些不同，现在的SOP应用了Elon Musk的五步工作法，要求尽可能裁剪需求）

15. **一般什么情况下会出错？**

    - 超过500行代码：部分函数实现会留空
    - 使用数据库时，它往往会实现错 —— 因为SQL初始化DB的过程往往不在代码里
    - 行数多了以后容易出现幻觉，调用一些不存在的API

16. **SD技能使用说明**

    - 目前SD技能是可调用的一个tool，实例化SDEngine，具体代码见 metagpt/tools/libs/sd_engine.py。

    - SD技能配置说明：SD接口目前基于 https://github.com/AUTOMATIC1111/stable-diffusion-webui 进行部署，对应环境配置和模型下载可参考上述github仓库，启动可支持api调用的SD服务，运行cmd中指定参数 nowebui，即：

      1. > python webui.py --enable-insecure-extension-access --port xxx --no-gradio-queue --nowebui
      2. 运行无报错的话，约1min左右模型加载后接口即可访问
      3. sd_url即为部署的服务器/机器IP:Port即为上述指定的端口，默认是7860

17. **安装时出现“另一个程序正在使用此文件...egg”**

    - 删除这个文件之后重试
    - 或者 手动`pip install -r requirements.txt`

18. **MetaGPT名字的来源？**

    - 这个名字是和GPT-4迭代了十几轮以后，由GPT-4打分给出的

19. **有没有更step by step的安装教程？**

    - 油管：[一个提示词写游戏 Flappy bird, 比AutoGPT强10倍的MetaGPT，最接近AGI的AI项目=一个软件公司产品经理+程序员](https://youtu.be/Bp95b8yIH5c)

20. **openai.error.RateLimitError: You exceeded your current quota, please check your plan and billing details**

    - 如果免费额度还没用完，在配置中设置RPM: 3或者更低
    - 如果免费额度已经用完了，考虑充值

21. **n_borg中的borg是什么意思？**

    - https://en.wikipedia.org/wiki/Borg
    - 博格文明是基于被称为集体的蜂巢或群体思维。每个Borg个体都通过复杂的亚空间网络与集体相连，确保每个成员都得到持续的监督和指导。集体意识使他们不仅能够“分享相同的想法”，而且还能够迅速适应新的策略。集体中的单个个体很少说话，但集体“声音”有时会传输到船上。

22. **怎么使用claude api？**

    - 在 config2.yaml 配置 llm 信息，具体配置请看：https://docs.deepwisdom.ai/main/zh/guide/get_started/configuration/llm_api_configuration.html#anthropic-claude-api

23. **是否支持Llama2/3？**

    - 在Llama2出来第一天社区同学就有实验，可以根据MG的结构输出。但是Llama2的context太短，很难出完一个完整项目，在正常使用Llama2之前，要先扩充context窗口到至少8k，这里如果有人推荐好的扩充模型或方法，可以直接评论
    - 现已支持可以参考如下文档进行配置：https://docs.deepwisdom.ai/main/zh/guide/get_started/configuration/llm_api_configuration.html#llama-3-70b-instruct-via-openrouter

24. **`mermaid-cli getElementsByTagName SyntaxError: Unexpected token '.'`**

    - 升级node到14.x及以上版本
    - `npm install -g n`
    - `n stable` 安装node稳定版（v18.x）

25. **tenacity.RetryError: RetryError**

    - 参考 faq8 解决网络问题
    - model 使用 gpt-3.5-turbo-16k / gpt-4 https://github.com/geekan/MetaGPT/issues/117

### 参考

1.  [MetaGPT-Dev-SOP](https://deepwisdom.feishu.cn/wiki/EI91wZdcciqmtvknZMkcgHGgn3e)
1.  [0723-MetaGPT walkthrough](https://deepwisdom.feishu.cn/docx/A0abdLlZJogwsRxjkQucifVinsd)
