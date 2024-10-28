<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/github.css';
// Then register the languages you need
hljs.registerLanguage('python', python);

import json1 from './datas/credit-g/tree_01.json';
import json2 from './datas/credit-g/tree_02.json';
import json3 from './datas/credit-g/tree_03.json';
import json4 from './datas/credit-g/tree_04.json';
import json5 from './datas/credit-g/tree_05.json';
import json6 from './datas/credit-g/tree_06.json';
import json7 from './datas/credit-g/tree_07.json';
import json8 from './datas/credit-g/tree_08.json';
import json9 from './datas/credit-g/tree_09.json';
import json10 from './datas/credit-g/tree_10.json';

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

const list = [
  json1,
  json2,
  json3,
  json4,
  json5,
  json6,
  json7,
  json8,
  json9,
  json10,
];
const index = ref(0);
const data = ref(dealDatatoTree(json1));
const dataTree = dealDatatoTree(json10);
const hasData = (d) => {
  return list[index.value].find((_) => _.id === d.id);
};

const calGap = (count) => {
  const maxw = document.body.clientWidth - 600;
  return Math.max((maxw - count * 60) / count, 10);
};
const prev = () => {
  if (index.value === 0) return;
  index.value -= 1;
};
const next = () => {
  if (index.value >= list.length - 1) return;
  index.value += 1;
};

const activeNode = computed(() => {
  return list[index.value].filter((_) => _.active);
});

const domref = ref();
const draw = () => {
  const canvas = document.querySelector('canvas');
  const wraper = document.querySelector('.ballgraph');
  canvas.width = wraper.offsetWidth;
  canvas.height = wraper.offsetHeight;
  const ctx = canvas.getContext('2d');
  const d = list[index.value];

  if (ctx) {
    for (const item of d) {
      if (item.parent_id) {
        const parentEl = document.getElementById(item.parent_id);
        const el = document.getElementById(item.id);

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

        // 执行绘制
        ctx.stroke();
        ctx.closePath();
      }
    }
    for (let i = 0; i < activeNode.value.length; i++) {
      const node = activeNode.value[i];
      const el = document.getElementById(node.id);
      const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = el;
      const target = document.querySelectorAll('.node')[i];
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
      ctx.lineTo(ol, ot);
      ctx.lineTo(ol, ot + oh);
      // ctx.lineTo(offsetLeft + offsetWidth, offsetTop + offsetHeight / 2);
      ctx.fillStyle = '#0000000b';
      ctx.fill();
      // ctx.stroke();
      ctx.closePath();
    }
  }
};

useResizeObserver(domref, draw);
nextTick(() => {
  draw();
});

watch(index, () => {
  data.value = dealDatatoTree(list[index.value]);
  nextTick(() => {
    draw();
  });
});
window.setInterval(() => {
  next();
}, 2000);
function scoreToColor(score) {
  if (score >= 97) return '#2C3FCB'; // 100 - 85: 深蓝
  if (score >= 96) return '#3B5AF7'; // 85 - 70: 亮蓝
  if (score >= 95) return '#587DF8'; // 70 - 55: 中蓝
  if (score >= 94.5) return '#7A9FF9'; // 55 - 40: 浅蓝
  if (score >= 94) return '#9FBDFB'; // 40 - 25: 更浅的蓝
  if (score >= 10) return '#C5D9FC'; // 25 - 10: 非常浅的蓝
  return '#EBF3FE'; // 10 - 0: 几乎白色
}
function scoreToTextColor(score) {
  if (score >= 25) return '#fff';
  return '#1d2129';
}
const isLast = computed(() => {
  return index.value === list.length - 1;
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
  arr.length;
  return arr.slice(0, 10).join('\n') + '\n......';
};
const getRealItem = (ite) => {
  return list[index.value].find((_) => _.id === ite.id) || {};
};

const activeTreeNode = ref();
const setActiveTreeNode = (node) => {
  if (!isLast.value) {
    return;
  }

  if (activeTreeNode.value?.id === node.id) {
    activeTreeNode.value = undefined;
  } else {
    activeTreeNode.value = node;
  }
};
</script>

<template>
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
            active: getRealItem(ite).active,
            gray: getRealItem(ite).visits === 0,
            selected: activeTreeNode?.id === ite.id,
          }"
          :id="getRealItem(ite).id"
          :style="getStyle(getRealItem(ite))"
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
          <span class="text-35px font-500">score</span>
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
      <template v-if="activeTreeNode">
        <div class="node">
          <div class="instruction bg">
            Insight: {{ activeTreeNode.instruction }}
          </div>
          <div>
            <pre><code v-html="hljs.highlight(getCode(activeTreeNode.code), { language: 'python' }).value"></code>
          </pre>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="node of activeNode" class="node">
          <div class="instruction bg">Insight: {{ node.instruction }}</div>
          <div>
            <pre><code v-html="hljs.highlight(getCode(node.code), { language: 'python' }).value"></code>
          </pre>
          </div>
        </div>
        <div class="stacknodes">
          <div class="node">
            <div class="instruction">Vannila instruction without insight</div>
            <div>
              <pre><code v-html="hljs.highlight('More generated code for the rest of the pipeline ...', { language: 'python' }).value"></code></pre>
            </div>
          </div>
          <div class="node">
            <div class="instruction">Vannila instruction without insight</div>
            <div>
              <pre><code v-html="hljs.highlight('More generated code for the rest of the pipeline ...', { language: 'python' }).value"></code></pre>
            </div>
          </div>
          <div class="node">
            <div class="instruction">Vannila instruction without insight</div>
            <div>
              <pre><code v-html="hljs.highlight('More generated code for the rest of the pipeline ...', { language: 'python' }).value"></code></pre>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ballgraph {
  display: flex;
  flex-direction: column;
  gap: 300px;
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
  height: 60px;
  width: 60px;
  border-radius: 20px;
  background-color: #d4d4d4;
  font-size: 25px;
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
  font-size: 20px;
  line-height: 1.5;
  color: #1d2129;
  border-left: 1px solid #e5e6eb;
  padding: 10px;
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
  font-size: 10px;
  line-height: 1.5;
}

.colormap {
  position: fixed;
  left: 10px;
  bottom: 10px;
  font-size: 30px;
  color: #88909b;
}

.colormap > div {
  height: 40px;
  width: 40px;
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
</style>
