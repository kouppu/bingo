import { BingoCard } from '../../../models/BingoCard';
import { ResultNums } from '../../../utils/bingo';
import { BINGO_NUM_LEN } from '../../../config';

let model = new BingoCard();
let cardNums: ResultNums[];

beforeEach(() => {
  model = new BingoCard();
  cardNums = model.getCardNums();
});

describe('check', () => {
  test('カードの数値時、Trueを返す', () => {
    expect(model.check(cardNums[0].num)).toBeTruthy();
  });

  test('カードの数値以外はFalseを返す', () => {
    expect(model.check(BINGO_NUM_LEN + 1)).not.toBeTruthy();
  });

  test('横軸リーチができる', () => {
    const rowReachPattern = [
      [0, 1, 2, 3],
      [5, 6, 7, 8],
      [10, 11, 12, 13],
      [15, 16, 17, 18],
      [20, 21, 22, 23],
    ];
    testReach(rowReachPattern);
  });

  test('縦軸リーチができる', () => {
    const colReachPattern = [
      [0, 5, 10, 15],
      [1, 6, 11, 16],
      [2, 7, 12, 17],
      [3, 8, 13, 18],
      [4, 9, 14, 19],
    ];
    testReach(colReachPattern);
  });

  test('斜め軸リーチができる', () => {
    const slantReachPattern = [
      [0, 6, 12, 18],
      [4, 8, 12, 16],
    ];
    testReach(slantReachPattern);
  });

  test('ビンゴ数がカウントされる', () => {
    cardNums.forEach((cardNum) => {
      model.check(cardNum.num);
    });
    // ビンゴは最大12ビンゴ
    expect(model.getBingoCount()).toBe(12);
  });
});

/**
 * パターンの各軸ごとにテストを行う
 * @param reachPattern
 */
const testReach = (reachPattern: number[][]) => {
  reachPattern.forEach((nums) => {
    model = new BingoCard();
    cardNums = model.getCardNums();
    nums.forEach((num) => {
      model.check(cardNums[num].num);
    });
    expect(model.getReachCount()).toBe(1);
  });
};
