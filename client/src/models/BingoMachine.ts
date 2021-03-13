import { difference } from 'lodash';
import { BINGO_NUM_LEN } from '../config';
import { createNums } from '../utils/bingo';
import { shuffleArray } from '../utils/common';

export class BingoMachine {
  // 抽選数値配列
  lotteryNums: number[] = [];

  // 結果数値配列
  resultNums: number[] = [];

  cards: number[][] = [];

  constructor() {
    this.lotteryNums = createNums(BINGO_NUM_LEN);
  }

  public getLotteryNums(): number[] {
    return this.lotteryNums;
  }

  public getResultNums(): number[] {
    return this.resultNums;
  }

  public runSlot(): void {
    this.lotteryNums = shuffleArray(this.lotteryNums);
  }

  public stopSlot(): number | false {
    const result = this.lotteryNums.pop();
    if (result === undefined) return false;

    this.resultNums.push(result);

    return result;
  }

  public createCard(): number[] {
    const card = this.createUniqueCard();
    this.cards.push(card);

    return card;
  }

  /**
   * 抽選が無くゲームが終了しているか
   */
  public isEnd(): boolean {
    if (this.lotteryNums.length === 0) {
      return true;
    }

    return false;
  }

  private createUniqueCard(): number[] {
    let card: number[] = [];
    let flag = false;

    while (!flag) {
      let count = 0;
      let nums = shuffleArray(createNums(BINGO_NUM_LEN));

      nums = nums.slice(0, 25);
      this.cards.forEach((_card) => {
        if (difference(nums, _card) !== []) {
          count += 1;
        }
      });
      if (count === this.cards.length) {
        card = nums;
        flag = true;
      }
    }

    return card;
  }
}
