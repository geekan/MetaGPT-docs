<template>
  <div class="author" v-if="authorInfo">
    <div class="text-15px font-400 lh-25px my-17px">
      {{ time }} · {{ `${readingTime} read` }}
    </div>
    <div class="flex flex-items-center gap-16px">
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
        <div class="title font-400 text-14px mt-4px lh-24px">
          {{ authorInfo.title }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useData } from 'vitepress';
import { authors } from './authors';
import { useCurrentElement } from '@vueuse/core';
import { formateDate } from '@/utils/tool';

const { frontmatter } = useData();
const authorInfo = authors.find((_) => _.name === frontmatter.value.author);
const time = frontmatter.value.createTime
  ? formateDate(frontmatter.value.createTime)
  : '';
const readingTime = frontmatter.value.readingTime;

const currentEle = useCurrentElement();

const linkfn = () => {
  window.open(authorInfo?.url, '_blank');
};

onMounted(() => {
  const title = document.querySelector('h1 ~*');
  const wraper = document.querySelector('.vp-doc div');
  wraper?.insertBefore(currentEle.value, title!);
});
onUnmounted(() => {
  currentEle.value.remove();
});
</script>
<style lang="scss"></style>
