<template>
  <div p22px>
    <div text-16px font-600>Articles</div>
    <div
      v-for="Article of listSortByTime"
      py-16px
      flex="~ gap-16px"
      border="0 solid #E5E6EB b"
      dark:border="0 solid #444 b"
    >
      <div w216px h144px flex-shrink-0 class="font-family: PingFang SC;">
        <img
          :src="withBase(Article.banner)"
          object-cover
          alt=""
          class="h100% w100%"
        />
      </div>
      <div flex="~ col gap" flex-grow-1>
        <div flex-grow-1>
          <div
            class="title hover:color-#165DFF"
            text-18px
            font-500
            cursor-pointer
            @click.prevent="go(Article.link)"
          >
            {{ Article.title }}
          </div>
          <div
            class="description"
            style="color: var(--vp-c-text-2)"
            text-14px
            py11px
          >
            {{ Article.description }}
          </div>
        </div>

        <div class="footer" flex="~">
          <div flex-grow-1 flex="~ gap8px">
            <span
              v-for="tag of Article.tag"
              style="
                background-color: var(--vp-custom-block-tip-bg);
                color: var(--vp-c-tip-3);
              "
              text-12px
              font-400
              px-12px
              >{{ tag }}</span
            >
          </div>

          <div text="14px" style="color: var(--vp-c-text-2)">
            <span>{{ Article.author }}</span>
            <span class="bg-#D9D9D9" inline-block w2px h10px mx16px></span>
            <span>{{ formateDate(Article.date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { formateDate } from '@/utils/tool';
import { useRouter, useData, withBase } from 'vitepress';
type Article = {
  title: string;
  description: string;
  author: string;
  date: string;
  tag: string[];
  link: string;
  banner: string;
};

const router = useRouter();
const { lang } = useData();

const props = defineProps<{ list: Article[] }>();

const list = toRef(props, 'list');

const listSortByTime = computed<Article[]>(() => {
  return [...list.value].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
});

const go = (url: string) => {
  if (url.startsWith('http')) {
    window.open(url, '_blank');
  } else {
    const prefix = `/${lang.value}`;
    router.go(withBase(`${prefix}${url}`));
  }
};
</script>
<style lang="scss"></style>
