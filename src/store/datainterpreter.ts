const loading = ref<boolean>(false);
const datas = ref<IDemo[]>([]);
const failed = ref(false);
export const DataInterpreterStore = () => {
  const getData = async () => {
    if (datas.value.length) {
      return;
    }
    loading.value = true;
    try {
      const result = await fetch(
        `https://public-frontend-1300249583.cos.accelerate.myqcloud.com/data/0329/diList.json`
      );
      datas.value = await result.json();
    } catch {
      failed.value = true;
    } finally {
      loading.value = false;
    }
  };

  return {
    getData,
    loading,
    failed,
    datas,
  };
};

function raceWithCatch(promises: Promise<Response>[]) {
  return new Promise<Response>((resolve, reject) => {
    let errorCount = 0;

    for (const promise of promises) {
      promise
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          errorCount++;
          if (errorCount === promises.length) {
            reject(new Error('All promises failed'));
          }
        });
    }
  });
}
