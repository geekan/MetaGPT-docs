<template>
  <div class="h770px bg-#f7f8fa" mt20px mb20px p16px leading-18px text-14px>
    <div class="h100% flex bg-#fff" p16px flex="gap16px">
      <div w200px pr0 class="h100%" rounded="4px" overflow-y-scroll>
        <div
          v-for="game of games"
          :key="game"
          class="p8px cursor-pointer rounded bg-#fafafa"
          :class="activeGame === game ? 'bg-gray-200' : ''"
          hover:bg-gray-200
          mb16px
          rounded="4px"
          @click="switchGame(game)"
        >
          <div line-height-36px>{{ TAndD[game - 1][0] }}:</div>
          <div text-12px italic>
            {{ TAndD[game - 1][1].split('\n')[1] }}
          </div>
        </div>
      </div>
      <div
        class="h100% flex bg-#f7faff"
        flex="1 col"
        rounded="4px"
        leading-24px
        of-x-scroll
        ref="scrollerRef"
      >
        <div
          m16px
          bg="#f5f5f5"
          text="#666"
          p16px
          font-400
          rounded="20px"
          style="white-space: pre-line"
        >
          {{ TAndD[activeGame - 1]?.[1] }}
        </div>
        <template v-for="(item, i) of realGameData">
          <div
            v-if="textVisible(item)"
            :key="`${item.player_name}${item.msg_type}${i}`"
            class="flex"
            p16px
            flex="gap16px"
          >
            <div
              w46px
              h46px
              rounded="50%"
              bg-gray
              flex-shrink-0
              overflow-hidden
            >
              <img class="m0!" :src="icons[item.role]" alt="" />
            </div>
            <div class="flex" flex="gap8px col">
              <div color="#4e5969" font-size-14px font-400 flex gap8px>
                {{ item.player_name }}
                <span
                  class="color-#2080f0 bg-#2080f01a py-0px px-7px rounded-40"
                  text-12px
                  border
                >
                  {{ item.role }}
                </span>

                <span ml4px text-12px>
                  {{
                    isThink(item.msg_type) || isExperience(item.msg_type)
                      ? item.msg_type
                      : ''
                  }}
                </span>
              </div>
              <div
                bg="#fff"
                p16px
                font-400
                style="border-radius: 0 20px 20px; white-space: pre-line"
                :border="
                  isThink(item.msg_type)
                    ? '#07aaff 1px dashed'
                    : isExperience(item.msg_type)
                    ? '#07aaff 1px'
                    : ''
                "
                :op="
                  isThink(item.msg_type) || isExperience(item.msg_type)
                    ? 50
                    : 100
                "
              >
                {{ getText(item) }}

                <button
                  v-if="
                    isExperience(item.msg_type) || isReflection(item.msg_type)
                  "
                  size="small"
                  class="bg-#165dff color-#fff px-15px rounded-2px h28px"
                  @click="item.xxx = !item.xxx"
                >
                  {{ item.xxx ? 'collapse' : 'expand' }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div
        font-size-24px
        flex
        flex-col
        flex-items-center
        color="#4E5969"
        gap8px
      >
        <div
          cursor-pointer
          :class="playing ? 'i-i-mdi:pause-box' : 'i-mdi:play-box'"
          @click="playing = !playing"
        ></div>
        <div
          cursor-pointer
          :class="
            playTimes === 1
              ? 'i-mdi:numeric-1-box'
              : 'i-mdi:numeric-1-box-outline'
          "
          @click="playTimes = 1"
        ></div>
        <div
          cursor-pointer
          :class="
            playTimes === 3
              ? 'i-mdi:numeric-3-box'
              : 'i-mdi:numeric-3-box-outline'
          "
          @click="playTimes = 3"
        ></div>
        <div
          cursor-pointer
          :class="
            playTimes === 10
              ? 'i-mdi:numeric-10-box'
              : 'i-mdi:numeric-10-box-outline'
          "
          @click="playTimes = 10"
        ></div>
        <div
          cursor-pointer
          :class="
            thinkVisible
              ? 'i-mdi:thought-bubble'
              : 'i-mdi:thought-bubble-outline'
          "
          @click="
            thinkVisible = !thinkVisible;
            experienceVisible = !experienceVisible;
            reflectionVisible = !reflectionVisible;
          "
        ></div>
        <!-- <div
          cursor-pointer
          :class="experienceVisible ? 'i-mdi:lightbulb-alert' : 'i-mdi:lightbulb-alert-outline'"
          @click="experienceVisible = !experienceVisible"
        ></div> -->

        <div cursor-pointer class="i-mdi:fast-forward" @click="finish"></div>
        <div
          v-for="(item, index) of characters"
          :key="index"
          flex
          flex-col
          flex-items-center
        >
          <div w46px h46px rounded="50%" bg-gray flex-shrink-0 overflow-hidden>
            <img class="m0!" :src="icons[item]" alt="" />
          </div>
          <span font-size-12px> player{{ index + 1 }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loop } from '@/utils/tool';

import Moderator from '@/blog/werewolf/images/上帝法官.png';
import Villager from '@/blog/werewolf/images/平民.png';
import Guard from '@/blog/werewolf/images/守卫.png';
import Seer from '@/blog/werewolf/images/预言家.png';
import Werewolf from '@/blog/werewolf/images/狼人.png';
import Witch from '@/blog/werewolf/images/女巫.png';

const cloneDeep = (val: Object) => JSON.parse(JSON.stringify(val));

const icons: Record<string, string> = {
  Moderator,
  Villager,
  Guard,
  Seer,
  Werewolf,
  Witch,
};

type TText = {
  msg_type: string;
  player_name: string;
  role: string;
  text: string;
  xxx?: boolean;
};
const originJsons = import.meta.glob('@/blog/werewolf/*.json', {
  eager: true,
});

const jsons = Object.values(originJsons) as {
  data: TText[];
  info: string;
}[];

const TAndD = [
  [
    'Edge of Balance',
    "Edge of Balance:\n Until the final moments, villagers and werewolves battle with equal might. In a game of shifting trust, a werewolf's clever ruse brings the match to its razor-thin conclusion.",
  ],
  [
    'Seer Imposter',
    'Seer Imposter:\n After inadvertently killing the seer on the first night, a wolf pretends to be the seer and misleads the group.',
  ],
  [
    'Trust and Betrayal',
    "Trust and Betrayal:\n Wolves are voted out on the first and second days. Villagers trust the second seer for it provides useful information. When the wolves can't change the voting outcome, they betray one of their own.",
  ],
  [
    "Witch's Last Stand",
    "Witch's Last Stand:\n A standard game, highlighted by the witch poisoning a werewolf at a critical moment.",
  ],
  [
    'United Defenders',
    'United Defenders:\n The game shines with the impeccable cooperation between special roles. In a dance of protection and healing, they shield each other from the shadows, showcasing the power of unity against deception.',
  ],
];

const realGameData = ref<TText[]>([]);
const playing = ref(false);

const games = ref(Array.from({ length: jsons.length }, (_, i) => i + 1));
const activeGame = ref<number>(0);
let cache: null | TText = null;

const switchGame = (gameIndex: number) => {
  realGameData.value = [];
  activeGame.value = gameIndex;
  cache = null;
  playing.value = true;
};
const gameData = computed<TText[] | null>(() => {
  return jsons[activeGame.value - 1]?.data || null;
});
const characters = computed(() => {
  if (!jsons[activeGame.value - 1]?.info) {
    return [];
  }

  return jsons[activeGame.value - 1].info
    .split('\n')
    .slice(1)
    .filter((_) => _)
    .map((x) => x.split(': ')[1]?.slice(0, -1));
});

const playTimes = ref(3);
const thinkVisible = ref(true);
const experienceVisible = ref(true);
const reflectionVisible = ref(true);

const isExperience = (type: string) => {
  return ['EXPERIENCES'].includes(type);
};
const isReflection = (type: string) => {
  return ['REFLECTION'].includes(type);
};

const getText = (record: TText) => {
  if (isExperience(record.msg_type)) {
    return record.xxx ? record.text : 'experience';
  }
  if (isReflection(record.msg_type)) {
    return record.xxx ? record.text : 'reflection';
  }
  return record.text;
};
const isThink = (type: string) => {
  return ['REFLECTION', 'THOUGHTS'].includes(type);
};
const textVisible = (textItem?: TText) => {
  if (!textItem) return false;
  if (isThink(textItem.msg_type)) {
    return thinkVisible.value && Boolean(textItem.text);
  }
  if (isExperience(textItem.msg_type)) {
    return experienceVisible.value && Boolean(textItem.text);
  }
  if (isExperience(textItem.msg_type)) {
    return reflectionVisible.value && Boolean(textItem.text);
  }
  return Boolean(textItem.text);
};

const scrollerRef = ref<HTMLElement>();

const play = () => {
  if (!playing.value) return;
  const i = realGameData.value.length;
  if (cache) {
    const d = realGameData.value[i - 1];
    if (d) {
      d.text = cache.text.slice(0, d.text.length + 3);
    }
    if (!textVisible(cache) || d.text.length >= cache.text.length) {
      Object.assign(d, cache);
      cache = null;
      play();
    }
  } else {
    const d = gameData.value?.[i];
    if (d?.msg_type === 'EXPERIENCES' || d?.msg_type === 'REFLECTION') {
      realGameData.value.push(d);
      play();
    } else {
      if (d) {
        realGameData.value.push({
          ...cloneDeep(d),
          text: d.text.slice(0, 3),
        });
      }
      cache = d || null;
      if (!textVisible(d) && d) {
        play();
      }
    }
  }
  if (!cache && realGameData.value.length === gameData.value?.length) {
    playing.value = false;
  }
  nextTick(() => {
    scrollerRef.value?.scrollTo({ top: 99999 });
  });
};

const finish = () => {
  realGameData.value = gameData.value || [];
  cache = null;
};

onMounted(() => {
  const time = computed(() => {
    return 200 / playTimes.value;
  });
  loop(() => {
    play();
  }, time);

  switchGame(1);
});
</script>
