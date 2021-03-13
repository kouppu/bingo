import { useRef, useEffect, useState } from 'react';
import * as io from 'socket.io-client';
import * as BingoCardModel from '../../models/BingoCard';
import * as UserModel from '../../models/User';
import { APP } from '../../config';

import { Error, ResultNums, LocalStorage } from '../types';

type Join = (roomId: string, name: string) => void;

/**
 * ローカルストレージに格納
 */
const save = (
  roomId: string,
  userId: string,
  userName: string,
  cardNums: ResultNums[]
): void => {
  localStorage.setItem('roomId', roomId);
  localStorage.setItem('userId', userId);
  localStorage.setItem('userName', userName);
  localStorage.setItem('nums', JSON.stringify(cardNums));
};

/**
 * ローカルストレージのデータを取得
 */
const recover = (): LocalStorage | false => {
  const roomId = localStorage.getItem('roomId');
  if (roomId === null) {
    return false;
  }
  const userId = localStorage.getItem('userId');
  if (userId === null) {
    return false;
  }
  const userName = localStorage.getItem('userName');
  if (userName === null) {
    return false;
  }
  const cardNums = localStorage.getItem('nums');
  if (cardNums === null) {
    return false;
  }

  return {
    roomId,
    userId,
    userName,
    cardNums: JSON.parse(cardNums),
  };
};

const useRoom = (id: string): [ResultNums[], boolean, boolean, Join, Error] => {
  const socket = useRef<SocketIOClient.Socket>();
  const bingoCard = useRef<BingoCardModel.BingoCard>();
  const user = useRef<UserModel.User>();
  const roomId = useRef<string>(id);

  // 初回フラグ
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
  const [isJoin, setIsJoin] = useState<boolean>(false);
  const [error, setError] = useState<Error>({ isError: false, message: '' });
  const [cardNums, setCardNums] = useState<ResultNums[]>([]);

  useEffect(() => {
    const client = io.default(APP.socketEndpoint);

    const localData = recover();
    if (localData !== false && roomId.current === localData.roomId) {
      // 復元する
      bingoCard.current = new BingoCardModel.BingoCard(localData.cardNums);
      setCardNums(bingoCard.current.getCardNums());
      client.emit('joinRoom', {
        roomId: localData.roomId,
        name: localData.userName,
      });
    } else {
      // 初回
      bingoCard.current = new BingoCardModel.BingoCard();
      setCardNums(bingoCard.current.getCardNums());
      setIsFirstTime(true);
    }

    client.on('notifySuccessfulJoin', (data: any) => {
      if (typeof bingoCard.current === 'undefined') return;

      user.current = new UserModel.User(data.userId, data.userName);
      data.resultNums.forEach((num: number) => {
        check(num);
      });
      setIsJoin(true);
      save(
        data.roomId,
        data.userId,
        data.userName,
        bingoCard.current.getCardNums()
      );
    });

    client.on('notifyBingoNum', (data: any) => {
      check(data.num);
    });

    client.on('error', (data: any) => {
      // Socket側エラー時
      setError({
        isError: true,
        message: data.message,
      });
    });

    socket.current = client;
  }, []);

  /**
   * ビンゴカードをチェックする
   */
  const check = (num: number): void => {
    if (typeof bingoCard.current === 'undefined') return;
    bingoCard.current.check(num);
    // 新しい配列を作らないと再レンダリングされない
    setCardNums(
      bingoCard.current.getCardNums().map((value) => {
        return value;
      })
    );
  };

  /**
   * ルームに参加
   */
  const join = (name: string): void => {
    if (typeof socket.current === 'undefined') return;
    socket.current.emit('joinRoom', { roomId: roomId.current, name });
  };

  return [cardNums, isJoin, isFirstTime, join, error];
};

export default useRoom;
