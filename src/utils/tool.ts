import { ComputedRef } from 'vue';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat.js';
dayjs.extend(LocalizedFormat);

/**
 * 下载文件
 * @param filename 文件名
 * @param blob 下载文件的blob数据
 */
export const downloadFile = (filename: string, blob: Blob) => {
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  // 5.释放这个临时的对象url
  window.URL.revokeObjectURL(url);
};

/**
 * 根据种子生成随机数
 * @param max 最大值
 * @param min 最小值
 * @param seed 种子值
 * @returns 随机数
 */
export function seedRandom(max: number, min: number, seed: number): number {
  const rMax = max || 1;
  const rMin = min || 0;

  const rSeed = (seed * 9301 + 49297) % 233280;
  const rnd = rSeed / 233280.0;
  return Math.round(min + (rnd * rMax - rMin));
}

/**
 * 判断一个值的类型是否是 type
 * @param param unknow
 * @param type type
 * @returns boolean
 */
export const isTargetType = (param: unknown, type: `[object ${string}]`) => {
  return Object.prototype.toString.call(param) === type;
};
/**
 * 判断一个值是否是boolean
 * @param param 参数
 * @returns boolean
 */
export const isBoolean = (param: unknown) =>
  isTargetType(param, '[object Boolean]');
/**
 * 判断一个值是否是Object
 * @param param 参数
 * @returns boolean
 */
export const isObject = (param: unknown) =>
  isTargetType(param, '[object Object]');

/**
 * 轮训某个值或者状态
 * @param fn 回调函数
 * @param delay 循环的间隔
 * @returns close 函数;
 */
export const loop = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (
    ...arg: any[]
  ) => { exit: boolean } | void | Promise<{ exit: boolean }> | Promise<void>,
  delay: ComputedRef<number>
) => {
  let timer: number;
  const l = async () => {
    const res = await fn();
    if (res?.exit) {
      return;
    }
    timer = window.setTimeout(async () => {
      l();
    }, delay.value);
  };
  l();
  return () => {
    window.clearTimeout(timer);
  };
};

/**
 * 判断是否为非0 等其他falsy值
 * @param val 要判断的值
 * @returns boolean
 */
export const isFalsy = (val: unknown) => {
  return !val && val !== 0;
};

/**
 * 复制文本到剪切板
 * @param text 要复制的文本
 */
export const CopyText = (text: string) => {
  // 非安全域
  if (navigator?.clipboard?.writeText) {
    navigator?.clipboard?.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'absolute';
    textarea.style.opacity = '0';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
  }
};

const getPoint = (maxX: number, maxY: number) => {
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  const r = 200 + Math.random() * 50;

  return { x, y, r, cr: 0 };
};

/** 绘制活动的线 */
export const draw = (dom: HTMLCanvasElement) => {
  const ctx = dom.getContext('2d');

  if (!ctx) return;
  const { width, height } = dom;

  const points: { x: number; y: number; r: number; cr: number }[] = [
    {
      x: 100,
      y: 100,
      r: 50,
      cr: 50,
    },
  ];
  const fn = async () => {
    if (Math.random() < 0.05 && points.length < 10) {
      points.push(getPoint(width, height));
    }
    ctx.clearRect(0, 0, width, height);

    for (const point of points) {
      ctx.beginPath();
      const alpha = Math.floor(0 + (1 - point.cr / point.r) * 50);

      const addZero = (str: string) => (str.length < 2 ? `0${str}` : str);
      ctx.strokeStyle = `#000000${addZero(alpha.toString(16))}`;

      ctx.moveTo(point.x + point.cr, point.y);
      ctx.arc(point.x, point.y, point.cr, 0, Math.PI * 2);
      point.cr += point.r / 100;
      if (point.cr >= point.r) {
        points.splice(points.indexOf(point), 1);
      }
      ctx.stroke();
      ctx.closePath();
    }

    requestAnimationFrame(fn);
  };

  fn();
};

export const formateDate = (date: string) => {
  const includeYear = dayjs().year() !== dayjs(date).year();
  const formatter = includeYear ? 'MMM D, YYYY' : 'MMM D';
  return dayjs(date).format(formatter);
};
