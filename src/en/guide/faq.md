# MetaGPT-Index / FAQ

> Our vision is to [extend human life](https://github.com/geekan/HowToLiveLonger) and [reduce working hours](https://github.com/geekan/MetaGPT/).

### Convenient Link for Sharing this Document:

```
https://docs.deepwisdom.ai/main/en/guide/faq.html
https://docs.deepwisdom.ai/main/zh/guide/faq.html
```

### Link

1.  Code：https://github.com/geekan/MetaGPT
2.  Roadmap：https://github.com/geekan/MetaGPT/blob/main/docs/ROADMAP.md
3.  EN
    1. Demo Video: [MetaGPT: Multi-Agent AI Programming Framework](https://www.youtube.com/watch?v=8RNzxZBTW8M)
    2. Tutorial: [MetaGPT: Deploy POWERFUL Autonomous Ai Agents BETTER Than SUPERAGI!](https://www.youtube.com/watch?v=q16Gi9pTG_M&t=659s)
    3. Author's thoughts video(EN): [MetaGPT Matthew Berman](https://youtu.be/uT75J_KG_aY?si=EgbfQNAwD8F5Y1Ak)
4.  CN
    1. Demo Video: [MetaGPT：一行代码搭建你的虚拟公司\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1NP411C7GW/?spm_id_from=333.999.0.0&vd_source=735773c218b47da1b4bd1b98a33c5c77)
    1. Tutorial: [一个提示词写游戏 Flappy bird, 比AutoGPT强10倍的MetaGPT，最接近AGI的AI项目](https://youtu.be/Bp95b8yIH5c)
    1. Author's thoughts video(CN): [MetaGPT作者深度解析直播回放\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1Ru411V7XL/?spm_id_from=333.337.search-card.all.click)

### How to become a contributor?

1.  Choose a task from the Roadmap (or you can propose one). By submitting a PR, you can become a contributor and join the dev team.
2.  Current contributors come from backgrounds including ByteDance AI Lab/JingDong/Didi/Xiaohongshu, Tencent/Baidu/MSRA/TikTok/BloomGPT Infra/Bilibili/CUHK/HKUST/CMU/UCB

### Chief Evangelist (Monthly Rotation)

MetaGPT Community - The position of Chief Evangelist rotates on a monthly basis. The primary responsibilities include:

1.  Maintaining community FAQ documents, announcements, and Github resources/READMEs.
2.  Responding to, answering, and distributing community questions within an average of 30 minutes, including on platforms like Github Issues, Discord and WeChat.
3.  Upholding a community atmosphere that is enthusiastic, genuine, and friendly.
4.  Encouraging everyone to become contributors and participate in projects that are closely related to achieving AGI (Artificial General Intelligence).
5.  (Optional) Organizing small-scale events, such as hackathons.

### FAQ

1. **Experience of Generated Repo Code**:

   - Some examples are available at [MetaGPT Release v0.1.0](https://github.com/geekan/MetaGPT/releases/tag/v0.1.0).

2. **Code Truncation / Parsing Failure**:

   - Check if the length is too long and consider using gpt-3.5-turbo-16k or another model with a higher token limit.

3. **Success Rate**:

   - No quantified statistics yet, but GPT-4 has a noticeably higher code generation success rate than gpt-3.5-turbo.

4. **Does it Support Incremental or Differential Updates (e.g., Resuming Half-Completed Tasks)?**

   - Supported. Refer to [Incremental Development Guide](https://docs.deepwisdom.ai/main/en/guide/in_depth_guides/incremental_development.html) for details.

5. **Does it Support Loading Existing Code?**

   - Not currently on the roadmap, but there are plans for it, which will take some time to implement.

6. **Does it Support Multiple Programming and Natural Languages?**

   - On the [ROADMAP](https://github.com/geekan/MetaGPT/blob/main/docs/ROADMAP.md); already supported.

7. **How Can I Join the Contributor Team?**

   - Submit a PR to become part of the contributor team. The current work focus is outlined on the [ROADMAP](https://github.com/geekan/MetaGPT/blob/main/docs/ROADMAP.md).

8. **PRD Stuck / Unreachable / Connection Interrupted**:

   - The official `OPENAI_API_BASE` endpoint is `https://api.openai.com/v1`.
   - If the official address is unreachable in your environment (verify with curl), consider using a reverse proxy like [openai-forward](https://github.com/beidongjiedeguang/openai-forward), setting `OPENAI_API_BASE` to `https://api.openai-forward.com/v1`.
   - Alternatively, configure `OPENAI_PROXY` to access the official `OPENAI_API_BASE` through a local proxy if needed. Be sure to disable `OPENAI_PROXY` if it's not required. Correct configuration example: `OPENAI_API_BASE: "https://api.openai.com/v1"`.
   - For persistent network issues, try a cloud environment, such as the [MetaGPT Quick Experience](https://deepwisdom.feishu.cn/wiki/Q8ycw6J9tiNXdHk66MRcIN8Pnlg).

9. **Are You Using Chi or Similar Services?**:

   - These services can occasionally encounter errors, with a higher error rate around 3.5k–4k tokens in GPT-4.

10. **What Does Max Token Mean?**:

    - This sets OpenAI’s maximum response length; exceeding the max token count will truncate the response.

11. **How to Change Investment Amount**:

    - Use the `--investment` parameter.
    - Run `python {startup.py} --help` to view all available commands.

12. **Which Python Version is Stable?**

    - Python 3.9 and 3.10.

13. **GPT-4 Not Available, Model Not Found (`The model gpt-4 does not exist`)**:

    - OpenAI requires a minimum $1 spend to access GPT-4. Running a small workload with gpt-3.5-turbo (after free credits are used) generally unlocks GPT-4 access.

14. **Can It Generate Code for Unseen Games?**

    - Per the README, it can produce recommendations or code for complex systems, such as a recommendation system similar to TikTok's. The prompt would be “Write a recommendation system like TikTok’s.”

15. **Common Error Scenarios**:

    - Code over 500 lines: Some functions may be left unimplemented.
    - Database usage: Initialization often has errors because the SQL DB setup is missing in the code.
    - For large codebases, hallucinations may occur, like calling nonexistent APIs.

16. **SD Skill Instructions**:

    - The SD skill is a callable tool, instantiated via `SDEngine` (see `metagpt/tools/libs/sd_engine.py`).
    - Deployment details are in [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui), for instance:
      1. `python webui.py --enable-insecure-extension-access --port xxx --no-gradio-queue --nowebui`
      2. Access the SD service after model loading (~1 min). Set `sd_url` to `IP:Port` (default 7860).

17. **File in Use Error during Installation**:

    - Delete the file and retry, or manually run `pip install -r requirements.txt`.

18. **Origin of MetaGPT’s Name?**:

    - After several rounds with GPT-4, it suggested and rated “MetaGPT” highly.

19. **Is there a More Step-by-Step Installation Guide?**

    - YouTube: [MetaGPT Overview](https://youtu.be/Bp95b8yIH5c)

20. **openai.error.RateLimitError**:

    - If free credits remain, set `RPM` to 3 or lower.
    - Consider upgrading to a paid plan if credits are depleted.

21. **What Does `borg` in `n_borg` Mean?**:

    - [Borg Civilization on Wikipedia](https://en.wikipedia.org/wiki/Borg) - refers to a collective or hive mind.

22. **How to Use the Claude API?**:

    - Configure `llm` in `config2.yaml`. Details: [Claude API Configuration](https://docs.deepwisdom.ai/main/zh/guide/get_started/configuration/llm_api_configuration.html#anthropic-claude-api).

23. **Does it Support Llama2/3?**

    - Llama2 was tested the first day it was released. Llama2 requires an extended context window for optimal project output (at least 8k tokens). See [Llama-3 Configuration](https://docs.deepwisdom.ai/main/zh/guide/get_started/configuration/llm_api_configuration.html#llama-3-70b-instruct-via-openrouter).

24. **SyntaxError in `mermaid-cli`**:

    - Update Node.js to version 14.x or later.
    - Use `npm install -g n` followed by `n stable` to install the stable Node version (v18.x).

25. **Tenacity Retry Error (`RetryError`)**:

    - Refer to FAQ #8 for network solutions.
    - Use model `gpt-3.5-turbo-16k` or `gpt-4`. See [GitHub Issue #117](https://github.com/geekan/MetaGPT/issues/117).

### Reference

1. [MetaGPT-Dev-SOP](https://deepwisdom.feishu.cn/wiki/EI91wZdcciqmtvknZMkcgHGgn3e)
2. [0723-MetaGPT walkthrough](https://deepwisdom.feishu.cn/docx/A0abdLlZJogwsRxjkQucifVinsd)
