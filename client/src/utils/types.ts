export interface Error {
  isError: boolean;
  message: string;
}

export interface ResultNums {
  num: number;
  displayNum: string;
  isChecked: boolean;
}

export interface LocalStorage {
  roomId: string;
  userId: string;
  userName: string;
  cardNums: ResultNums[];
}
