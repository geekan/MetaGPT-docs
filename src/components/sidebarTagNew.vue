<script setup lang="ts">
import { diff } from '@/utils/diff';
const fileArr = diff
  .split('\n')
  .map((_) => _.replace('src/', '').replace('.md', '.html'));

onMounted(() => {
  const links = document.querySelectorAll('.VPSidebarItem .VPLink');
  links.forEach((ele) => {
    const el = ele as HTMLAnchorElement;
    const includes = fileArr.find((_) => el.href.includes(_));
    if (!includes) {
      return;
    }
    const span = document.createElement('span');
    span.classList.add('sidebarTagNew');

    el?.append(span);
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
