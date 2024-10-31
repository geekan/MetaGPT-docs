<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/github.css';
// import { downloadFile } from '@/utils/download';

// 注册 Python 语言高亮
hljs.registerLanguage('python', python);
const trees = ref([]);

// 动态导入所有 JSON 文件
// const trees = import.meta.glob('./trees/*/*.json', { eager: true });
// 动态导入所有 ipynb 文件
// const notebooks = import.meta.glob('./trees/*/*.ipynb');

// 获取所有文件夹名称
const folders = [
  'mfeat-factors',
  'Click_prediction_small',
  'GesturePhaseSegmentationProcessed',
  'credit-g',
  'jasmine',
  'kc1',
  'kick',
  'segment',
  'smoker-status',
  'software-defects',
  'wine-quality-white',
];

// 当前选中的文件夹
const currentFolder = ref(folders[0]);

let maxScore = 100;
let minScore = 0;
// 根据当前文件夹获取对应的 JSON 文件列表
const list = computed(() => {
  if (!currentFolder.value) return [];

  const newList = trees.value;

  const scores = newList[newList.length - 1]
    ?.filter((item) => item.visits >= 1)
    ?.map((_) => Number(_.dev_score)) || [0, 100];
  maxScore = Math.max(...scores);
  minScore = Math.min(...scores);
  return newList;
});

const loading = ref(false);

// 修改fetchTreeData函数
const fetchTreeData = async (folder) => {
  loading.value = true;
  try {
    const promises = [];
    promises.push(
      fetch(
        `https://public-frontend-1300249583.cos.ap-nanjing.myqcloud.com/sela/notebooks/${folder}/tree.json`
      ).then((res) => res.json())
    );
    for (let i = 1; i < 11; i++) {
      const url = `https://public-frontend-1300249583.cos.ap-nanjing.myqcloud.com/sela/notebooks/${folder}/tree_${i
        .toString()
        .padStart(2, '0')}.json`;
      promises.push(fetch(url).then((res) => res.json()));
    }
    return await Promise.all(promises);
  } finally {
    loading.value = false;
  }
};

// 处理树形数据
const dealDatatoTree = (data) => {
  const root = data.find((_) => !_.parent_id);
  const arr = [[root]];
  let prevLevel = [root];
  let count = 1;
  let nextLevel = [];
  while (count < data.length) {
    prevLevel.forEach((_) => {
      nextLevel = nextLevel.concat(data.filter((__) => __.parent_id === _.id));
    });
    arr.push(nextLevel);
    count += nextLevel.length;
    prevLevel = nextLevel;
    nextLevel = [];
  }
  return arr;
};

const index = ref(0);
// const data = computed(() =>
//   list.value.length ? dealDatatoTree(list.value[index.value]) : []
// );
const dataTree = computed(() =>
  list.value.length ? dealDatatoTree(list.value[list.value.length - 1]) : []
);

const hasData = (d) => {
  return list.value[index.value]?.find((_) => _.id === d.id);
};

const calGap = (count) => {
  const maxw = document.body.clientWidth - 600;
  return Math.max((maxw - count * 40) / count, 8);
};

const prev = () => {
  if (index.value === 0) return;
  index.value -= 1;
};

const next = () => {
  if (index.value >= list.value.length - 1) {
    return;
  }
  index.value += 1;
};

const activeNode = computed(() => {
  return list.value[index.value]?.filter((_) => _.active) || [];
});

const domref = ref();
const draw = () => {
  const canvas = document.querySelector('canvas');
  const wraper = document.querySelector('.ballgraph');
  if (!canvas || !wraper) return;

  canvas.width = wraper.offsetWidth;
  canvas.height = wraper.offsetHeight;
  const ctx = canvas.getContext('2d');
  const d = dataWithActive.value;

  if (ctx && d) {
    // 绘制节点之间的连线
    for (const item of d) {
      if (item.parent_id) {
        const parentEl = document.getElementById(item.parent_id);
        const el = document.getElementById(item.id);
        if (!parentEl || !el) continue;

        const {
          offsetTop: poffsetTop,
          offsetLeft: poffsetLeft,
          offsetWidth: poffsetWidth,
          offsetHeight: poffsetHeight,
        } = parentEl;
        const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = el;

        ctx.beginPath();
        if (item.active) {
          ctx.strokeStyle = '#2C3FCB';
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = '#cacdd4';
          ctx.lineWidth = 1;
        }

        ctx.moveTo(
          poffsetLeft + poffsetWidth / 2,
          poffsetTop + poffsetHeight / 2
        );
        ctx.lineTo(offsetLeft + offsetWidth / 2, offsetTop + offsetHeight / 2);
        ctx.stroke();
        ctx.closePath();
      }
    }
    const actived = dataWithActive.value.filter((_) => _.active);

    for (let i = 0; i < actived.length; i++) {
      const node = actived[i];
      const el = document.getElementById(node.id);
      const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = el;
      const target = document.querySelectorAll('.rightpannel .node')[i];

      const {
        offsetTop: ot,
        offsetLeft: ol,
        offsetWidth: ow,
        offsetHeight: oh,
      } = target;

      ctx.beginPath();
      ctx.strokeStyle = '#cacdd4';
      ctx.setLineDash([4]);
      ctx.lineWidth = 1;
      ctx.moveTo(offsetLeft + offsetWidth, offsetTop + offsetHeight / 2);
      ctx.lineTo(ol, ot - 119 - 8);
      ctx.lineTo(ol, ot + oh - 119 - 8);
      // ctx.lineTo(offsetLeft + offsetWidth, offsetTop + offsetHeight / 2);
      ctx.fillStyle = '#0000000b';
      ctx.fill();
      // ctx.stroke();
      ctx.closePath();
    }
  }
};

const activeTreeNodeId = ref(null);
const activeTreeNode = computed(() => {
  return (
    list.value?.[index.value]?.find((_) => _.id === activeTreeNodeId.value) ||
    {}
  );
});
// 获取从根节点到目标节点的路径ID数组
const getNodePathIds = (nodeId, allNodes) => {
  const pathIds = [];
  let currentId = nodeId;

  while (currentId) {
    pathIds.unshift(currentId);
    const parentNode = allNodes.find((n) => n.id === currentId);
    currentId = parentNode?.parent_id;
  }

  return pathIds;
};

// 计算当前激活路径上的所有节点ID
const activePathIds = computed(() => {
  if (!activeTreeNodeId.value || !list.value[index.value]) {
    return new Set();
  }
  return new Set(
    getNodePathIds(activeTreeNodeId.value, list.value[index.value])
  );
});

const downloadNotebook = async (nodeId) => {
  const filePath = `https://public-frontend-1300249583.cos.ap-nanjing.myqcloud.com/sela/notebooks/${currentFolder.value}/Node-${nodeId}.ipynb`;
  const fileContent = await fetch(filePath).then((res) => res.blob());
  downloadFile(`Node-${nodeId}.ipynb`, fileContent);
};

// 计算带有激活状态的节点数据，不修改原数据
const dataWithActive = computed(() => {
  if (!list.value[index.value]) {
    return [];
  }
  return list.value[index.value].map((node) => ({
    ...node,
    active: activeTreeNodeId.value
      ? activePathIds.value.has(node.id)
      : node.active,
  }));
});

// 获取当前选中节点的完整路径上的所有节点
const activeNodePath = computed(() => {
  if (!activeTreeNodeId.value || !list.value[index.value]) {
    return [];
  }

  const pathIds = getNodePathIds(
    activeTreeNodeId.value,
    list.value[index.value]
  );
  return pathIds
    .map((id) => list.value[index.value].find((node) => node.id === id))
    .filter(Boolean);
});

useResizeObserver(domref, draw);

onMounted(() => {
  if (folders.length > 0) {
    currentFolder.value = folders[0];
  }
  nextTick(() => {
    draw();
  });
});

watch([index], () => {
  nextTick(() => {
    draw();
  });
});
// onMounted(async () => {
//   trees.value = await fetchTreeData(currentFolder.value);

// })

// 自动播放
let interval;
const startAutoPlay = () => {
  interval = window.setInterval(() => {
    if (index.value >= list.value.length - 1) {
      // index.value >= list.value.length - 1
      // dataTree 中所有层级中找到node 分数最大的那个
      const maxNode = dataTree.value.reduce(
        (max, item) => {
          console.log('item', item);
          const maxNode = item.reduce((max, node) =>
            Number(node.dev_score) > Number(max.dev_score) ? node : max
          );
          return Number(maxNode.dev_score) > Number(max.dev_score)
            ? maxNode
            : max;
        },
        { dev_score: -999 }
      );

      setActiveTreeNode(maxNode);

      if (interval) {
        clearInterval(interval);
      }
      return;
    }
    next();
  }, 2000);
};

const stopAutoPlay = () => {
  if (interval) {
    clearInterval(interval);
  }
};

// startAutoPlay();

onUnmounted(() => {
  stopAutoPlay();
});

function scoreToColor(score) {
  // 根据minScore - maxScore 平均划分为6个区间
  const percent = (score - minScore) / (maxScore - minScore);

  if (percent >= 0.833) return '#2C3FCB'; // 最高区间
  if (percent >= 0.666) return '#3B5AF7'; // 第二区间
  if (percent >= 0.5) return '#587DF8'; // 第三区间
  if (percent >= 0.333) return '#7A9FF9'; // 第四区间
  if (percent >= 0.166) return '#9FBDFB'; // 第五区间
  if (percent >= 0) return '#C5D9FC'; // 第六区间
  return '#EBF3FE'; // 兜底颜色
}

function scoreToTextColor(score) {
  //   if (score >= 25) return '#fff';
  // return '#1d2129';
  const percent = (score - minScore) / (maxScore - minScore);
  return percent >= 0.5 ? '#fff' : '#1d2129';
}

const isLast = computed(() => {
  return index.value === list.value.length - 1;
});

function getStyle(ite) {
  return `background-color: ${scoreToColor(
    ite.dev_score
  )};color:${scoreToTextColor(ite.dev_score)};visibility: ${
    hasData(ite) ? 'visible' : 'hidden'
  }`;
}

const getCode = (code) => {
  const arr = code.split('\n');
  return arr.slice(0, 10).join('\n') + '\n......';
};

const getRealItem = (ite) => {
  return list.value[index.value]?.find((_) => _.id === ite.id) || {};
};

// 修改后的 setActiveTreeNode 函数
const setActiveTreeNode = (node) => {
  if (!isLast.value) {
    return;
  }

  if (activeTreeNodeId.value === node.id) {
    activeTreeNodeId.value = null;
  } else {
    activeTreeNodeId.value = node.id;
  }

  nextTick(() => {
    draw();
  });
};

onMounted(() => {
  watch(
    currentFolder,
    async () => {
      stopAutoPlay();
      index.value = 0;
      activeTreeNodeId.value = null;
      trees.value = await fetchTreeData(currentFolder.value);

      startAutoPlay();
      nextTick(() => {
        draw();
      });
    },
    {
      immediate: true,
    }
  );
});
</script>
<template>
  <div class="demo-container">
    <!-- 添加loading遮罩 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <div>
      <div class="paper-reference">
        Demo page for
        <a href="https://arxiv.org/abs/2410.17238" target="_blank">SELA</a>
      </div>

      <!-- 文件夹选择器 -->
      <label class="dataset-label">Datasets</label>
      <select v-model="currentFolder" class="folder-select">
        <option v-for="folder in folders" :key="folder" :value="folder">
          {{ folder }}
        </option>
      </select>

      <div class="wraper" ref="domref">
        <div class="ballgraph">
          <div
            v-for="item of dataTree"
            class="ballLine"
            :style="`gap:${calGap(item.length)}px`"
          >
            <div
              v-for="ite of item"
              class="ball cursor-pointer"
              :class="{
                active: dataWithActive.find((n) => n.id === ite.id)?.active,
                gray: dataWithActive.find((n) => n.id === ite.id)?.visits === 0,
                selected: activeTreeNodeId === ite.id,
              }"
              :id="ite.id"
              :style="
                getStyle(dataWithActive.find((n) => n.id === ite.id) || ite)
              "
              @click="setActiveTreeNode(ite)"
            >
              <div>{{ getRealItem(ite).dev_score }}</div>
            </div>
          </div>
          <canvas class="linecanvas"></canvas>
        </div>

        <div class="colormap">
          <section>
            <div>
              <span class="text-24px font-500">score</span>
              <div>max</div>
            </div>
          </section>
          <div class="colorblock"></div>
          <div class="colorblock"></div>
          <div class="colorblock"></div>
          <div class="colorblock"></div>
          <div class="colorblock"></div>
          <div class="colorblock"></div>
          <div>min</div>
        </div>

        <div class="rightpannel">
          <template v-if="activeTreeNodeId">
            <div v-for="node in activeNodePath" :key="node.id" class="node">
              <div class="instruction bg">Insight: {{ node.instruction }}</div>
              <div>
                <pre><code v-html="hljs.highlight(getCode(node.code), { language: 'python' }).value"></code></pre>
              </div>
            </div>
          </template>
          <!-- <template> -->
          <template v-else>
            <div v-for="node of activeNode" class="node">
              <div class="instruction bg">Insight: {{ node.instruction }}</div>
              <div>
                <pre><code v-html="hljs.highlight(getCode(node.code), { language: 'python' }).value"></code></pre>
              </div>
            </div>
          </template>
          <div class="stacknodes">
            <div>
              <div class="node">
                <div class="instruction">
                  Vannila instruction without insight
                </div>
                <div>
                  <pre><code v-html="hljs.highlight('More generated code for the rest of the pipeline ...', { language: 'python' }).value"></code></pre>
                </div>
              </div>
              <div class="node">
                <div class="instruction">
                  Vannila instruction without insight
                </div>
                <div>
                  <pre><code v-html="hljs.highlight('More generated code for the rest of the pipeline ...', { language: 'python' }).value"></code></pre>
                </div>
              </div>
              <div class="node">
                <div class="instruction">
                  Vannila instruction without insight
                </div>
                <div>
                  <pre><code v-html="hljs.highlight('More generated code for the rest of the pipeline ...', { language: 'python' }).value"></code></pre>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="activeTreeNodeId && activeTreeNode?.visits >= 1"
            class="node"
          >
            <div class="instruction">Complete Code</div>
            <div class="download-container">
              <a
                download
                :href="`https://public-frontend-1300249583.cos.ap-nanjing.myqcloud.com/sela/notebooks/${currentFolder}/Node-${activeTreeNodeId}.ipynb`"
                class="download-link"
              >
                <div class="file-info">
                  <div class="file-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V9L13 2Z"
                        stroke="#88909B"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div class="file-details">
                    <div class="file-name">
                      Node-{{ activeTreeNodeId }}.ipynb
                    </div>
                    <!-- <div class="file-size">40.61KB</div> -->
                  </div>
                </div>
                <div class="download-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                      stroke="#88909B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="#88909B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 15V3"
                      stroke="#88909B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </a>
            </div>
          </div>
          <!-- </template> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.demo-container {
  position: relative;
  min-height: 400px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #ebf3fe;
  border-radius: 50%;
  border-top-color: #2c3fcb;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.folder-select {
  margin: 10px;
  padding: 5px 10px;
  border: 1px solid #e5e6eb;
  border-radius: 5px;
  font-size: 16px;
}

.ballgraph {
  display: flex;
  flex-direction: column;
  gap: 160px;
  position: relative;
  flex: 1;
}

.linecanvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.ballLine {
  display: flex;
  justify-content: center;
}

.ball {
  height: 40px;
  width: 40px;
  border-radius: 12px;
  background-color: #d4d4d4;
  font-size: 14px;
  color: #fff;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  &.active {
    outline: 2px solid #2c3fcb;
  }
  &.gray {
    background-color: #cacdd4 !important;
  }
  &.selected {
    border: 2px solid #2c3fcb;
  }
}

.wraper {
  display: flex;
  padding: 8px;
}

.rightpannel {
  width: 500px;
}

.node {
  margin: 10px;
  border: 1px solid #e5e6eb;
  border-radius: 5px;
  padding: 8px;
  margin-left: 0;
  color: #1d2129;
  box-sizing: border-box;
  box-shadow: 2px 2px 20px 1px rgba(0, 0, 0, 0.1);
}

.instruction {
  font-size: 16px;
  line-height: 1.5;
  color: #1d2129;
  border-left: 1px solid #e5e6eb;
  padding: 8px 10px;
  border-radius: 0 10px 10px 0;
}

.bg {
  background-color: #ebf3fe;
}

pre {
  padding: 8px;
  border-radius: 5px;
  background-color: #e5e6eb;
  overflow: auto;
  font-size: 12px;
  line-height: 1.5;
}

.colormap {
  position: fixed;
  left: 10px;
  bottom: 10px;
  font-size: 16px;
  color: #88909b;
}

.colormap > div {
  height: 24px;
  width: 24px;
}

.colormap > .colorblock:nth-of-type(1) {
  background-color: #2c3fcb;
}
.colormap > .colorblock:nth-of-type(2) {
  background-color: #3b5af7;
}
.colormap > .colorblock:nth-of-type(3) {
  background-color: #587df8;
}
.colormap > .colorblock:nth-of-type(4) {
  background-color: #7a9ff9;
}
.colormap > .colorblock:nth-of-type(5) {
  background-color: #9fbdfb;
}
.colormap > .colorblock:nth-of-type(6) {
  background-color: #c5d9fc;
}

.stacknodes {
  position: relative;
  margin-top: -10px;
  height: 150px;
}

.stacknodes .node {
  position: absolute;
  width: 390px;
  background-color: #fff;
  z-index: 3;
}

.stacknodes .node:nth-child(2) {
  position: absolute;
  width: 390px;
  left: 4px;
  top: 10px;
  z-index: 2;
}

.stacknodes .node:nth-child(3) {
  position: absolute;
  width: 390px;
  left: 8px;
  top: 20px;
  z-index: 1;
}

// 新增的下载相关样式
.download-container {
  margin-top: 12px;
  padding: 8px;
}

.download-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  background-color: #f7f8fa;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ebf3fe;
    border-color: #d0d3d9;
  }
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-details {
  display: flex;
  gap: 8px;
  align-items: center;
}

.file-name {
  font-size: 14px;
  color: #1d2129;
}

.file-size {
  font-size: 12px;
  color: #88909b;
}

.download-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #88909b;
  transition: transform 0.2s ease;
}

.download-link {
  &:hover {
    background-color: #ebf3fe;
    border-color: #d0d3d9;

    .download-icon {
      transform: translateY(2px);
    }
  }
}

.dataset-label {
  display: block;
  margin: 10px 10px 5px;
  color: #88909b;
  font-size: 14px;
}

.paper-reference {
  margin: 10px;
  color: #1d2129;
  font-size: 14px;

  a {
    color: #2c3fcb;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
