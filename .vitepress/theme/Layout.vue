<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { useData, useRoute, useRouter, withBase } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { nextTick, provide } from 'vue';
import Author from '../../src/components/author/author.vue';
import SidebarTagNew from '@/components/sidebarTagNew.vue';

const Layout = DefaultTheme.Layout;

const { isDark, theme, site } = useData();

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`,
  ];

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  }).ready;

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
    }
  );
});

useEventListener('click', (event) => {
  const target = event.target as HTMLAnchorElement;

  if (
    target.tagName.toLowerCase() === 'a' &&
    (/v[^\/]*\/$/.test(target.href) ||
      (target.href === 'https://docs.deepwisdom.ai/' &&
        target.target === '_blank'))
  ) {
    event.preventDefault();
    const link = `${target.href}${location.pathname
      .replace(site.value.base, '/')
      .slice(1)}`;
    window.open(link, target.target);
  }
});

const router = useRouter();
const route = useRoute();

onMounted(() => {
  if (!import.meta.env.DEV) {
    if (location.pathname === '/') {
      try {
        const navlist = site.value.themeConfig.nav;
        const stableVersion = navlist[navlist.length - 1].items.find((_: any) =>
          _.text.includes('(stable)')
        );

        location.href = stableVersion.link;

        return;
      } catch {}
    }
  }

  const baseWithoutLastSlash = site.value.base.replace(/\/$/, '');

  if (location.pathname.replace(/\/$/, '') === baseWithoutLastSlash) {
    router.go(withBase('/en/'));
  }
});
</script>

<template>
  <Layout>
    <template #doc-top>
      <Author></Author>
    </template>
    <template #sidebar-nav-before>
      <SidebarTagNew></SidebarTagNew>
    </template>
  </Layout>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>
