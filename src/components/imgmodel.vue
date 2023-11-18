<template>
  <Transition name="fade">
    <div
      v-if="imageModel"
      fixed
      top-0
      left-0
      right-0
      bottom-0
      z-500
      backdrop-blur-7
      flex="~  justify-center"
      flex-items-center
      @click="imageModel = undefined"
    >
      <div absolute top-0 left-0 right-0 bottom-0 bg-black:30 z--1 />
      <img
        :src="imageModel.src"
        :alt="imageModel.alt"
        max-w-full
        max-h-full
        object-contain
      />
    </div>
  </Transition>
</template>
<script setup lang="ts">
import { useEventListener, onKeyStroke } from '@vueuse/core';
const imageModel = ref<HTMLImageElement>();

useEventListener('click', async (e) => {
  const path = Array.from(e.composedPath());
  const first = path[0];
  if (!(first instanceof HTMLElement)) return;
  if (first.tagName !== 'IMG') return;
  if (
    path.some(
      (el) => el instanceof HTMLElement && ['A', 'BUTTON'].includes(el.tagName)
    )
  )
    return;
  if (
    !path.some(
      (el) => el instanceof HTMLElement && el.classList.contains('content')
    )
  )
    return;

  // Do not open image when they are moving. Mainly for mobile to avoid conflict with hovering behavior.
  const pos = first.getBoundingClientRect();
  await new Promise((resolve) => {
    window.setTimeout(resolve, 50);
  });
  const newPos = first.getBoundingClientRect();
  if (pos.left !== newPos.left || pos.top !== newPos.top) return;

  imageModel.value = first as HTMLImageElement;
});
onKeyStroke('Escape', (e) => {
  if (imageModel.value) {
    imageModel.value = undefined;
    e.preventDefault();
  }
});
</script>
<style lang="scss"></style>
