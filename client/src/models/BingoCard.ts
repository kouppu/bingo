import { BINGO_NUM_LEN } from '../config';
import { add0, createNums } from '../utils/bingo';
import { shuffleArray } from '../utils/common';

import { ResultNums } from '../utils/types';

export class BingoCard {
  cardNums: ResultNums[] = [];

  reachCount = 0;

  bingoCount = 0;

  constructor(cardNums: ResultNums[] = []) {
    if (cardNums.length === 0) {
      this.createCardNums(shuffleArray(createNums(BINGO_NUM_LEN)));
    } else {
      this.cardNums = cardNums;
    }
  }

  public getCardNums(): ResultNums[] {
    return this.cardNums;
  }

  public getReachCount(): number {
    return this.reachCount;
  }

  public getBingoCount(): number {
    return this.bingoCount;
  }

  /**
   * 引数の数値をチェック済みにする
   * @param num
   */
  public check(num: number): boolean {
    const index = this.cardNums.findIndex((obj) => obj.num === num);

    if (index === undefined || index === -1) return false;

    this.cardNums[index].isChecked = true;

    this.countReachAndBingo();

    return true;
  }

  /**
   * カード数値オブジェクト配列を生成する
   * 本来はゲーム単位にユニークであるべきだが、処理が複雑になるので一旦これで
   */
  private createCardNums(nums: number[]): void {
    const cardNums: ResultNums[] = [];

    nums.slice(0, 25).forEach((value) => {
      cardNums.push({
        num: value,
        displayNum: add0(value),
        isChecked: false,
      });
    });

    // 真ん中ならチェック済みに
    cardNums[12].isChecked = true;
    cardNums[12].displayNum = '●';

    this.cardNums = cardNums;
  }

  /**
   * リーチとビンゴの数をカウント
   */
  private countReachAndBingo(): void {
    // 初期化
    this.reachCount = 0;
    this.bingoCount = 0;

    // ビンゴケース：配列のキー（列）
    const rowPattern = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
    ];
    // ビンゴケース：配列のキー（行）
    const colPattern = [
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
    ];
    // ビンゴケース：配列のキー（斜め）
    const slantPattern = [
      [0, 6, 12, 18, 24],
      [4, 8, 12, 16, 20],
    ];

    let result = this.countPattern(rowPattern);
    this.reachCount += result.reachCount;
    this.bingoCount += result.bingoCount;

    result = this.countPattern(colPattern);
    this.reachCount += result.reachCount;
    this.bingoCount += result.bingoCount;

    result = this.countPattern(slantPattern);
    this.reachCount += result.reachCount;
    this.bingoCount += result.bingoCount;
  }

  /**
   * 引数のパターン内のビンゴリーチをカウント
   * @param pattern 縦、横、斜め配列
   */
  private countPattern(
    pattern: number[][]
  ): { reachCount: number; bingoCount: number } {
    let reachCount = 0;
    let bingoCount = 0;
    pattern.forEach((arr) => {
      let count = 0;
      arr.forEach((index) => {
        const cardNum = this.cardNums[index];
        if (cardNum.isChecked) {
          count += 1;
        }
      });
      switch (count) {
        case 4:
          reachCount += 1;
          break;
        case 5:
          bingoCount += 1;
          break;
        default:
          break;
      }
    });

    return { reachCount, bingoCount };
  }
}
