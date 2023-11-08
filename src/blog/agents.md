---
layout: page
list:
  - title: Implementing Werewolf Game in MetaGPT
    description: 'In their paper, "Exploring Large Language Models for Communication Games: An Empirical Study on Werewolf," Xu et al. explore the potential of large language models (LLM) in the popular game Werewolf, using MetaGPT as a multi-agent framework. Their challenge: Can MetaGPT recreate vibrant gameplay? Today, they share their exciting affirmative answer!'
    author: deepwisdom
    date: 2023-10-10T00:00:00.000+00:00
    tag:
      - Werewolf
      - Agent
    link: /blog/werewolf/
    banner: /blog-banners/werewolf.jpeg
---

<script setup>
  import BlogList from '@/components/BlogList.vue';

</script>

<BlogList :list="$frontmatter.list"/>
