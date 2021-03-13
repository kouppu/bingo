import { BingoMachine } from '../../../models/BingoMachine';
import { BINGO_NUM_LEN } from '../../../config';

let model = new BingoMachine();

beforeEach(() => {
  model = new BingoMachine();
});

test('シャッフルされる', () => {
  // 低確率でシャッフルした結果、同じ場合があるかも
  const nums = replicateArray(model.getLotteryNums());
  model.runSlot();
  expect(nums).not.toEqual(model.getLotteryNums());
});

describe('stopSlot', () => {
  test('先頭の数値が取得できる', () => {
    const nums = replicateArray(model.getLotteryNums());
    expect(model.stopSlot()).toBe(nums.pop());
  });

  test('結果が結果数値配列に入っている', () => {
    const num = model.stopSlot();
    const nums = model.getResultNums();
    expect(num).toBe(nums[0]);
  });
});

test('ビンゴの玉が無くなってゲームが終了する', () => {
  for (let i = 0; i < BINGO_NUM_LEN; i += 1) {
    model.runSlot();
    model.stopSlot();
  }
  expect(model.isEnd()).toBeTruthy();
});

const replicateArray = (arr: number[]) => {
  return arr.slice(0, arr.length);
};
