<template></template>
<script setup lang="ts">
import { diff, currendBranch } from '@/utils/diff';
const fileArr = diff
  .split('\n')
  .map((_) => _.replace('src/', '').replace('.md', '.html'));
const cacheKey = `${currendBranch}:cachenew`;

const cached = ref<string[]>([]);

try {
  const d = JSON.parse(localStorage.getItem(cacheKey) || '');
  cached.value = d;
} catch (e) {}

onMounted(() => {
  const links = document.querySelectorAll('.VPSidebarItem .VPLink');
  links.forEach((ele) => {
    const el = ele as HTMLAnchorElement;
    const includes = fileArr.find((_) => el.href.includes(_));
    if (!includes || cached.value.includes(el.href)) {
      return;
    }
    const span = document.createElement('span');
    span.classList.add('sidebarTagNew');
    el?.append(span);

    el.addEventListener('click', () => {
      span.remove();
      cached.value.push(el.href);
      localStorage.setItem(cacheKey, JSON.stringify(cached.value));
    });
  });
});
</script>
<style>
.sidebarTagNew {
  flex-shrink: 0;
  display: inline-block;
  font-size: 12px;
  font-style: italic;
  color: #008000;
  font-weight: 400;
  width: 20px;
  height: 11.6px;
  background-image: url(../public/new.png);
  background-size: 100% 100%;
}
</style>
