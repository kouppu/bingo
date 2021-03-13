import { ResultNums } from './types';

/**
 * 指定した長さの配列を作成する
 * @param len 配列の長さ
 */
export function createNums(len: number): number[] {
  const result = [];
  for (let i = 1; i <= len; i += 1) {
    result.push(i);
  }

  return result;
}

/**
 * 結果欄オブジェクト配列を生成する
 * @param len 配列の長さ
 */
export function createResultNums(len: number): ResultNums[] {
  const nums = createNums(len);
  const resuletNums: ResultNums[] = [];
  nums.forEach((value) => {
    resuletNums.push({ num: value, displayNum: add0(value), isChecked: false });
  });

  return resuletNums;
}

/**
 * 該当する結果のオブジェクトをチェック済みにする
 * @param resultNums 結果欄オブジェクト配列
 * @param result ビンゴ結果の数値 該当するのがなければfalse
 */
export function checkResultNums(
  resultNums: ResultNums[],
  result: number
): ResultNums[] | false {
  const findedObj = resultNums.find((obj) => obj.num === result);

  if (findedObj === undefined) return false;

  // Es-lintに怒られるので、新たにオブジェクト配列を生成
  const checkedResultNums: ResultNums[] = [];
  resultNums.forEach((obj) => {
    const param = {
      num: obj.num,
      displayNum: obj.displayNum,
      isChecked: false,
    };

    if (obj.isChecked) {
      // 既にチェック済みなら
      param.isChecked = true;
    }

    if (obj.num === findedObj.num) {
      // 結果と一致するなら
      param.isChecked = true;
    }

    checkedResultNums.push(param);
  });

  return checkedResultNums;
}

/**
 * 0 ~ 9なら頭に0を付与する
 * 01,02など
 * @param num
 */
export function add0(num: number): string {
  if (
    num === 0 ||
    num === 1 ||
    num === 2 ||
    num === 3 ||
    num === 4 ||
    num === 5 ||
    num === 6 ||
    num === 7 ||
    num === 8 ||
    num === 9
  ) {
    return `0${String(num)}`;
  }

  return String(num);
}
