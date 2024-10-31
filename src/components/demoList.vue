<template>
  <div class="demowrap flex gap-16px">
    <div class="imgside w-500px flex-shrink-0">
      <img class="p16px w100%" src="/authors.jpg" alt="" />
      <div class="divider"></div>
      <img class="p16px w100%" src="/plans.png" alt="" />
      <div class="divider"></div>
      <div class="p16px text-16px">
        Check
        <span
          class="cursor-pointer font-700"
          style="color: var(--vp-c-brand-1)"
          @click="toDataInterpreterUsage"
          >here</span
        >
        for detailed usage of Data Interpreter
      </div>
    </div>
    <div v-if="failed" class="w100%">
      <div
        class="text-16px flex1 flex flex-justify-center flex-items-center h200px"
      >
        The data retrieval failed. Please refresh the page and try again.
      </div>
    </div>
    <div class="demoList" v-else>
      <div
        v-if="loading"
        class="flex1 flex flex-justify-center flex-items-center h200px"
      >
        <Spin tip="loading"></Spin>
      </div>
      <template v-else>
        <div
          v-for="(item, index) of datas"
          :key="item.project"
          class="demoItem"
          @click="toDetail(item)"
        >
          <div class="font-500 h44px">{{ item.project }}</div>
          <Tooltip :content="item.prompt" position="top">
            <div class="line-clamp-3 font-400 text-12px">{{ item.prompt }}</div>
          </Tooltip>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DataInterpreterStore } from '@/store/datainterpreter';
import { Tooltip, Spin } from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.min.css';
import { useRouter, withBase, useData } from 'vitepress';

const { lang } = useData();

const { datas, failed, getData, loading } = DataInterpreterStore();

const router = useRouter();
const toDetail = (index: IDemo) => {
  const prefix = `/${lang.value}`;
  router.go(withBase(`${prefix}/DataInterpreter/detail?id=${index.pathIndex}`));
};

const toDataInterpreterUsage = () => {
  const prefix = `/${lang.value}`;
  router.go(withBase(`${prefix}/guide/use_cases/agent/interpreter/intro`));
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
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  grid-gap: 16px;
  padding: 16px 0;
  justify-content: space-around;
  .demoItem {
    overflow: hidden;
    padding: 16px;
    border-radius: 10px;
    border: 8px solid #f5f5f5;
    box-sizing: border-box;
    cursor: pointer;
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
