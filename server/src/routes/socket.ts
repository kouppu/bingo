import * as http from 'http';
import Server = require('socket.io');
import * as socketIO from 'socket.io';

interface User {
  id: string;
  name: string;
}

class Socket {
  // ルーム参加人数の上限
  public static readonly MAX_JOIN_ROOM: number = 50;
  private io!: Server.Server;

  constructor(httpServer: http.Server, clientOrigins: Array<string>) {
    this.io = new Server(httpServer, {
      origins: clientOrigins,
    });
  }

  public start(): void {
    this.io.on('connection', (socket: socketIO.Socket) => {
      console.log(socket.id)
      /** ホスト */
      // ホスト参加
      socket.on('createRoom', () => {
        const roomId = this.createRoomId(socket.id);
        socket.join(roomId);
        this.resNotifySuccessfulCreate(socket.id, roomId);
      });

      socket.on('notifySuccessfulJoin', (data: any) => {
        this.resSuccessfulJoin(
          data.userId,
          data.roomId,
          data.userName,
          data.resultNums
        );
      });

      // ビンゴの出た数字を取得
      socket.on('notifyBingoNum', (data: any) => {
        this.resBingoNum(socket, data.num);
      });

      /** ビンゴカード */

      // カード参加
      socket.on('joinRoom', (data: any) => {
        if (this.io.sockets.adapter.rooms[data.roomId] === undefined) {
          // ルームが作れていなければ
          this.resError(socket.id, 'ホストが見つかりませんでした。');
          return;
        }

        if (
          this.io.sockets.adapter.rooms[data.roomId].length >
          Socket.MAX_JOIN_ROOM
        ) {
          // ルーム参加人数上限を超えていたら
          this.resError(socket.id, '参加人数の上限を超えています。');
          return;
        }

        socket.join(data.roomId);

        this.resNotifyUserJoinRoom(data.roomId, {
          id: socket.id,
          name: data.name,
        });
      });
    });
  }

  /**
   * ルームID生成
   * @param socketId
   */
  private createRoomId(socketId: string): string {
    return `room_${socketId}`;
  }

  /**
   * ルームの作成に成功したことを通知
   * @param socketId
   * @param roomId
   */
  private resNotifySuccessfulCreate(socketId: string, roomId: string): void {
    this.io.to(socketId).emit('notifySuccessfulCreate', {
      roomId: roomId,
    });
  }

  /**
   * ユーザー参加通知
   * @param roomId
   * @param user
   */
  private resNotifyUserJoinRoom(roomId: string, user: User): void {
    this.io.to(roomId).emit('notifyUserJoinRoom', { user });
  }

  /**
   * ルームに参加できたことを本人に通知
   * @param userId
   * @param roomId
   * @param userName
   * @param resultNums
   */
  private resSuccessfulJoin(
    userId: string,
    roomId: string,
    userName: string,
    resultNums: number[]
  ): void {
    this.io.to(userId).emit('notifySuccessfulJoin', {
      roomId: roomId,
      userId: userId,
      userName: userName,
      resultNums: resultNums,
    });
  }

  /**
   * ホスト以外にビンゴの出た数字を通知
   * @param socket
   * @param num
   */
  private resBingoNum(socket: socketIO.Socket, num: number): void {
    // 自分以外のroom参加IDを抽出
    const roomIds = Object.keys(socket.rooms).filter(
      (item) => item != socket.id
    );

    for (const roomId of roomIds) {
      socket.broadcast.to(roomId).emit('notifyBingoNum', {
        num: num,
      });
    }
  }

  /**
   * クライアントにエラーを通知
   * @param socketId
   * @param message
   */
  private resError(socketId: string, message: string): void {
    this.io.to(socketId).emit('error', {
      message: message,
    });
  }
}

export default Socket;
