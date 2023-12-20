# MetaGPT: 多智能体框架

<p align="center">
<b>使 GPT 以软件公司的形式工作，协作处理更复杂的任务</b>
</p>

1. MetaGPT输入**一句话的老板需求**，输出**用户故事 / 竞品分析 / 需求 / 数据结构 / APIs / 文件等**
2. MetaGPT内部包括**产品经理 / 架构师 / 项目经理 / 工程师**，它提供了一个**软件公司**的全过程与精心调配的SOP
   1. `Code = SOP(Team)` 是核心哲学。我们将SOP具象化，并且用于LLM构成的团队

![A software company consists of LLM-based roles](/image/software_company_cd.jpg)

<p align="center">软件公司多角色示意图</p>

## MetaGPT的能力

<video  controls>
  <source src="https://github.com/geekan/MetaGPT/assets/34952977/34345016-5d13-489d-b9f9-b82ace413419" type="video/mp4">
</video>

MetaGPT从软件公司开始，但它的能力并不局限于此。你可以在自己的场景里使用这个多智能体框架来搭建属于自己的应用，具体的，你可以参考**示例**下的[调研员](../use_cases/agent/researcher)。让我们开始吧。

## 样例（由GPT-4生成）

例如，如果你执行`metagpt "Design a RecSys like Toutiao"`，将会得到包括数据类型&API设计在内的输出

![Jinri Toutiao Recsys Data & API Design](/image/data_api_design.png)

生成一个包含分析和设计内容的样例的成本约为 **$0.2** （使用GPT-4），而生成一个完整项目的成本约为 **$2.0** 。
