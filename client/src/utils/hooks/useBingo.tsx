import { useEffect, useState, useRef } from 'react';
import * as io from 'socket.io-client';
import { BINGO_NUM_LEN, APP } from '../../config';
import { createResultNums, checkResultNums, add0 } from '../bingo';
import * as BingoMachineModel from '../../models/BingoMachine';
import * as UserModel from '../../models/User';

import { Error, ResultNums } from '../types';

type Spin = () => void;
type Stop = () => void;

const useBingo = (): [
  string,
  ResultNums[],
  string,
  UserModel.User[],
  boolean,
  boolean,
  boolean,
  Spin,
  Stop,
  Error
] => {
  const socket = useRef<SocketIOClient.Socket>();
  const bingoMachine = useRef(new BingoMachineModel.BingoMachine());
  const roomId = useRef<string>('');
  const timer = useRef<number>();

  const [displayNum, setDisplayNum] = useState<string>('00');
  const [resultNums, setResultNums] = useState<ResultNums[]>([]);
  const [users, setUsers] = useState<UserModel.User[]>([]);
  const [isJoin, setIsJoin] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const [error, setError] = useState<Error>({ isError: false, message: '' });

  useEffect(() => {
    const client = io.default(APP.socketEndpoint);

    setResultNums(createResultNums(BINGO_NUM_LEN));
    bingoMachine.current.createCard();

    client.on('connect', () => {
      client.emit('createRoom');
    });

    client.on('notifySuccessfulCreate', (data: any) => {
      roomId.current = data.roomId;
      setIsJoin(true);
    });

    // ユーザーがルームに参加
    client.on('notifyUserJoinRoom', (data: any) => {
      const user = new UserModel.User(data.user.id, data.user.name);
      setUsers((prevUsers) => [...prevUsers, user]);

      client.emit('notifySuccessfulJoin', {
        roomId: roomId.current,
        userId: data.user.id,
        userName: data.user.name,
        resultNums: bingoMachine.current.getResultNums(),
      });
    });
    socket.current = client;
  }, []);

  /**
   * ランダムな数値を表示する
   */
  const displayRandomNum = (): void => {
    // 表示用乱数を設定
    const i = Math.floor(Math.random() * BINGO_NUM_LEN);
    setDisplayNum(add0(i));
  };

  /**
   * ビンゴ回転
   */
  const spin = (): void => {
    if (isPlay) return;
    if (isEnd) return;

    const _timer = window.setInterval(() => {
      displayRandomNum();
    }, 80);

    bingoMachine.current.runSlot();
    timer.current = _timer;
    setIsPlay(true);
  };

  /**
   * ビンゴ停止
   */
  const stop = (): void => {
    if (typeof socket.current === 'undefined') return;
    if (!isPlay) return;
    if (timer.current) {
      window.clearInterval(timer.current);
    }
    const result = bingoMachine.current.stopSlot();
    if (result === false) {
      handleError();

      return;
    }

    const checked = checkResultNums(resultNums, result);
    if (checked === false) {
      handleError();

      return;
    }

    // カード側に通知
    socket.current.emit('notifyBingoNum', {
      roomId: roomId.current,
      num: result,
    });

    setResultNums(checked);
    setDisplayNum(add0(result));
    setIsPlay(false);

    if (bingoMachine.current.isEnd() === true) {
      setIsEnd(true);
    }
  };

  const handleError = (message = 'Error'): void => {
    setError({
      isError: true,
      message,
    });
  };

  return [
    displayNum,
    resultNums,
    roomId.current,
    users,
    isJoin,
    isEnd,
    isPlay,
    spin,
    stop,
    error,
  ];
};

export default useBingo;
