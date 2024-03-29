<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/ipynb2html@0.4.0-rc.1/dist/notebook.min.css"
    crossorigin="anonymous"
  />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css"
  />
  <link
    v-if="isDark"
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
  <link
    v-else="isDark"
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />

  <div class="demoWraper" v-if="detailItem">
    <div class="prompt">
      <div class="text-20px font-500 pb-8px">Requirement</div>
      <template v-if="detailItem.prompt.length > 300">
        {{
          isShort ? `${detailItem.prompt.slice(0, 200)} ...` : detailItem.prompt
        }}
        <span
          class="cursor-pointer"
          style="color: var(--vp-c-brand-1)"
          @click="isShort = !isShort"
          >{{ isShort ? 'view more' : 'close' }}</span
        >
      </template>
      <template v-else>
        {{ detailItem.prompt }}
      </template>
    </div>
    <div class="content">
      <div class="text-20px font-500 absolute left-8px top-8px">Plan</div>
      <div class="text-20px font-500 absolute left-210px top-8px">Code</div>
      <div class="dots-side" ref="svgwraperRef"></div>
      <div class="vp-doc" @scroll="onScroll" v-html="detailItem.html"></div>
    </div>
  </div>
  <div v-else-if="loading">
    <div
      class="text-16px flex1 flex flex-justify-center flex-items-center h200px"
    >
      <Spin tip="loading"></Spin>
    </div>
  </div>
  <div v-else-if="failed">
    <div
      class="text-16px flex1 flex flex-justify-center flex-items-center h200px"
    >
      The data retrieval failed. Please refresh the page and try again.
    </div>
  </div>
</template>
<script setup lang="tsx">
import { Graphviz } from '@hpcc-js/wasm';
import { Popover } from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.min.css';
import { useData } from 'vitepress';
import { DataInterpreterStore } from '@/store/datainterpreter';
import { Spin } from '@arco-design/web-vue';

const { isDark } = useData();

const getDotData = (tasks: any) => {
  const dotEdges = tasks
    .map((item: any) => {
      if (!item.dependent_task_ids.length) return '';
      return item.dependent_task_ids
        .map((_: any) => {
          return `${_}->${item.task_id}`;
        })
        .join(';\n');
    })
    .filter((_: any) => _)
    .join(';\n');

  return `
strict digraph {
  bgcolor="transparent"
  node [shape="circle",height=0.4,width=0.4];
  edge [arrowsize=0.5,minlen=2,color="#4E5969",arrowhead="open"];
  ${dotEdges};
}
`;
};

let activeIndex = ref(0);
const onScroll = (e: UIEvent) => {
  const tags = document.querySelectorAll<HTMLElement>('[id*=task]');
  const wraper = e.target as HTMLElement;
  tags.forEach((_, index) => {
    if (wraper.scrollTop + 100 > _.offsetTop) {
      activeIndex.value = index;
    }
  });
};

const isShort = ref(true);

const svgwraperRef = ref<HTMLElement>();
const svgStr = ref('');
const renderSvg = async () => {
  const g = await Graphviz.load();
  const dotData = getDotData(detailItem.value?.data.tasks);
  svgStr.value = g.dot(dotData, 'svg');

  if (!svgwraperRef.value) {
    return;
  }
  svgwraperRef.value.innerHTML = svgStr.value;
  nextTick(() => {
    const nodes = document.querySelectorAll('g.node');
    nodes.forEach((_) => {
      const x = +_.querySelector('ellipse')!.getAttribute('cx')!;
      const y = +_.querySelector('ellipse')!.getAttribute('cy')!;
      const r = +_.querySelector('ellipse')!.getAttribute('rx')!;
      const index = _.querySelector('text')!.innerHTML;

      const clickevn = () => {
        const target = document.querySelector(`#task-${index}`);
        if (target) {
          target?.scrollIntoView({ behavior: 'smooth' });
        }
      };
      const app = createApp({
        render: () => (
          <foreignObject x={x - r} y={y - r} width={r * 2} height={r * 2}>
            <Popover
              position="right"
              v-slots={{
                default: () => (
                  <div
                    onClick={clickevn}
                    class={{
                      svgdot: true,
                      active: activeIndex.value + 1 === +index,
                    }}
                    style={{
                      width: `${r * 2}px`,
                      height: `${r * 2}px`,
                    }}
                  >
                    {index}
                  </div>
                ),
                content: () => (
                  <div key={Math.random()} class="text-16px">
                    <div class="flex flex-col">
                      <span class="c-#1D2129 font-500">task_type</span>
                      <span class="max-w-300px ">
                        {detailItem.value?.data.task_map[index].task_type}
                      </span>
                    </div>
                    <div class="mt-8px flex flex-col">
                      <span class="c-#1D2129 font-500">instruction</span>
                      <span class="max-w-300px">
                        {detailItem.value?.data.task_map[index].instruction}
                      </span>
                    </div>
                  </div>
                ),
              }}
            ></Popover>
          </foreignObject>
        ),
      });
      app.mount(_);
    });
  });
};

const detailItem = ref<IDemo>();

const loading = ref(false);
const failed = ref(false);
const getData = async () => {
  const urlItem = new URL(window.location.href);

  const id = urlItem.searchParams.get('id');
  if (!id) {
    return;
  }
  try {
    loading.value = true;
    const result = await fetch(
      `https://public-frontend-1300249583.cos.accelerate.myqcloud.com/data/0329/di/${id}.json`
    );
    detailItem.value = await result.json();
    renderSvg();
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  getData();
});
</script>
<style lang="scss" scoped>
.demoWraper {
  display: flex;
  margin: 0 auto;
  max-width: 1640px;
  height: calc(100vh - var(--vp-nav-height));
  flex-direction: column;
  overflow: hidden;

  .prompt {
    flex-shrink: 0;
    border-bottom: 1px solid var(--vp-c-divider);
    padding: 16px 8px;
  }
  .content {
    display: flex;
    overflow: hidden;
    flex: 1;
    position: relative;
  }
  .dots-side {
    padding-top: 40px;
    width: 200px;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
    border-right: 1px solid var(--vp-c-divider);
    ::v-deep(svg) {
      max-height: 100%;
    }
  }
  .vp-doc {
    flex: 1;
    overflow: auto;
    padding: 1.4em;
    padding-left: calc(7.5em + 30px);
  }
}
</style>
<style lang="scss">
.svgdot {
  background-color: #c9dcff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  color: #3c3c43;
  &:hover {
    background-color: #b2ccff;
  }
  &.active {
    background-color: var(--vp-c-brand-1);
    color: #fff;
  }
}
.nb-source > pre {
  border-color: var(--vp-c-divider) !important;
}
.dark {
  .svgdot {
    background-color: #b7bfff;
    &:hover {
      background-color: #94a0ff;
    }
    &.active {
      background-color: #606feb;
    }
  }
  .nb-source.nb-input {
    pre {
      background-color: #282a35;
    }
  }
  .nb-stdout {
    background-color: transparent;
  }
  .nb-error,
  .nb-stderr {
    background-color: #352828;
  }
}
</style>
