<template>
  <div class="author flex flex-items-center gap-16px mt-48px" v-if="authorInfo">
    <img
      class="h50px w50px rounded-50% cursor-pointer"
      :src="authorInfo.image_url"
      alt="avatar"
      @click="linkfn"
    />
    <div>
      <div
        class="name c-#1064d3 font-600 text-17px lh-22px cursor-pointer"
        @click="linkfn"
      >
        {{ authorInfo.name }}
      </div>
      <div class="title c-#1c1e21 font-400 text-14px mt-4px lh-24px">
        {{ authorInfo.title }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useData } from 'vitepress';
import { authors } from './authors';
import { useCurrentElement } from '@vueuse/core';

const { frontmatter } = useData();
const authorInfo = authors.find((_) => _.name === frontmatter.value.author);

const currentEle = useCurrentElement();

const linkfn = () => {
  window.open(authorInfo?.url, '_blank');
};

onMounted(() => {
  console.log(currentEle.value);
  const title = document.querySelector('h1 ~*');
  const wraper = document.querySelector('.vp-doc div');
  wraper?.insertBefore(currentEle.value, title!);
});
</script>
<style lang="scss"></style>
