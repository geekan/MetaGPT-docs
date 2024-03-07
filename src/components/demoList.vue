<template>
  <div class="demowrap flex gap-24px">
    <div class="imgside w-500px flex-shrink-0">
      <img class="p16px w100%" src="/authors.jpg" alt="" />
      <div class="divider"></div>
      <img class="p16px w100%" src="/plans.png" alt="" />
    </div>
    <div class="demoList">
      <div
        v-if="loading"
        class="flex1 flex flex-justify-center flex-items-center h200px"
      >
        <Spin tip="loading"></Spin>
      </div>
      <template v-else>
        <div
          v-for="(item, index) of lists"
          :key="item.project"
          class="demoItem"
          @click="toDetail(index)"
        >
          <div class="font-500 h44px">{{ item.project }}</div>
          <Tooltip :content="item.prompt" position="top">
            <div class="line-clamp-3 font-300 text-12px">{{ item.prompt }}</div>
          </Tooltip>
        </div>
        <i></i><i></i><i></i><i></i><i></i>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Tooltip, Spin } from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.min.css';
import { useRouter, withBase, useData } from 'vitepress';

const { lang } = useData();

const lists = ref<IDemo[]>([]);
const loading = ref(false);
const getData = async () => {
  loading.value = true;
  const datas = await fetch(
    `https://metagpt.us-ca.ufileos.com/data/demos.json?t=${2}`
  );

  const djson = await datas.json();
  loading.value = false;
  lists.value = djson;
};

const router = useRouter();
const toDetail = (index: number) => {
  const prefix = `/${lang.value}`;
  router.go(withBase(`${prefix}/demos/detail?id=${index}`));
};

onMounted(() => {
  getData();
});
</script>
<style lang="scss">
.demowrap {
  max-width: 1640px;
  margin: 0 auto;
  align-items: flex-start;

  .imgside {
    margin-top: 16px;
    background-color: #f5f5f5;
    border-radius: 10px;
    .divider {
      height: 1px;
      background-color: #ececec;
    }
  }
}
.demoList {
  display: flex;
  flex-wrap: wrap;
  flex: 1;

  gap: 20px;
  padding: 16px;
  justify-content: space-around;
  > i {
    content: '';
    width: 330px;
  }
  .demoItem {
    width: 330px;
    overflow: hidden;
    padding: 16px;
    border-radius: 10px;
    border: 8px solid #f5f5f5;
    box-sizing: border-box;
    cursor: pointer;
    // &:hover {
    //   box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    // }
  }
}
.dark {
  .demoItem {
    background-color: #262638;
    box-shadow: none !important;
    border: none;
    &:hover {
      background-color: #606feb;
    }
  }
  .imgside {
    background-color: #262638;
    .divider {
      height: 1px;
      background-color: #3e3e55;
    }
  }
}
</style>
