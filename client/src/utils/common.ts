/**
 * クリップボードにコピー
 * @param string
 */
export function execCopy(string: string): boolean {
  // 空div 生成
  const tmp = document.createElement('div');
  // 選択用のタグ生成
  const pre = document.createElement('pre');

  // 親要素のCSSで user-select: none だとコピーできないので書き換える
  pre.style.webkitUserSelect = 'auto';
  pre.style.userSelect = 'auto';

  tmp.appendChild(pre).textContent = string;

  // 要素を画面外へ
  const s = tmp.style;
  s.position = 'fixed';
  s.right = '200%';

  // body に追加
  document.body.appendChild(tmp);
  // 要素を選択
  const selection = document.getSelection();
  if (selection === null) return false;

  selection.selectAllChildren(tmp);

  // クリップボードにコピー
  const result = document.execCommand('copy');

  // 要素削除
  document.body.removeChild(tmp);

  return result;
}

/**
 * 配列をシャッフルする
 * @param arr
 */
export function shuffleArray(arr: [] | number[]): [] | number[] {
  const arrLength = arr.length;
  // Fisher-Yates shuffleアルゴリズム
  for (let i = arrLength - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    // eslint-disable-next-line no-param-reassign
    arr[i] = arr[j];
    // eslint-disable-next-line no-param-reassign
    arr[j] = tmp;
  }

  return arr;
}
