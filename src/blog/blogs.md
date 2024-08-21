---
layout: page
list:
  - title: MetaGPT X Technical Report
    description: 'Recently, multi-agent systems powered by Large Language Models (LLMs) have gained popularity for tasks ranging from research to software development.  Our goal is to build autonomous agents that significantly accelerate the workflow in software development, enhancing capabilities in natural language programming.'
    author: DeepWisdom
    date: 2024-08-20T00:00:00.000+00:00
    tag:
      - Multi-agents
      - SWE-Bench Lite
    link: /blog/swebench/MetaGPT X Technical Report
    banner: /blog-banners/swebench.png
  - title: Implementing Werewolf Game in MetaGPT
    description: 'In their paper, "Exploring Large Language Models for Communication Games: An Empirical Study on Werewolf," Xu et al. explore the potential of large language models (LLM) in the popular game Werewolf, using MetaGPT as a multi-agent framework. Their challenge: Can MetaGPT recreate vibrant gameplay? Today, they share their exciting affirmative answer!'
    author: DeepWisdom
    date: 2023-10-10T00:00:00.000+00:00
    tag:
      - Werewolf
      - GameAgent
    link: /blog/werewolf/
    banner: /blog-banners/werewolf.jpeg

  - title: 'METAGPT: META PROGRAMMING FOR A MULTI-AGENT COLLABORATIVE FRAMEWORK'
    description: Remarkable progress has been made on automated problem solving through societies of agents based on large language models (LLMs). Existing LLM-based multi-agent systems can already solve simple dialogue tasks.
    author: DeepWisdom
    date: 2023-08-01T00:00:00.000+00:00
    tag:
      - Research
    link: 'https://arxiv.org/pdf/2308.00352.pdf'
    banner: /blog-banners/blog2.png

  - title: MetaGPT Leverages Human Collaboration Techniques for Multi-Agent-Based Software Engineering
    description: Created by a team of researchers from Chinese and US universities, MetaGPT is a new LLM-based meta programming framework aiming to enable collaboration in multi-agent systems by leveraging human procedural knowledge to enhance robustness, reduce errors, and engineer software solutions for complex tasks.
    author: Sergio De Simone
    date: 2023-08-24T00:00:00.000+00:00
    tag:
      - Insight
    link: 'https://www.infoq.com/news/2023/08/metagpt-agent-collaboration/'
    banner: /blog-banners/blog8.jpg

  - title: AI Workforce & MetaGPT for the Future of Work
    description: The evolution of the workplace in the 21st century is punctuated by the relentless march of technological advancements, particularly the deepening footprint of artificial intelligence (AI). Within this vast domain, multi-agent systems and Large Language Models (LLMs) are redefining the paradigms of task execution, collaboration, and decision-making.
    author: 1001 epochs
    date: 2023-10-19T00:00:00.000+00:00
    tag:
      - Insight
    link: 'https://www.1001epochs.ch/blog/metagpt-for-future-of-work'
    banner: /blog-banners/blog9.png
---

<script setup>
  import BlogList from '@/components/BlogList.vue';

</script>

<BlogList :list="$frontmatter.list"/>
