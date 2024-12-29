export interface IUnit {
  uid: number
  type: number
  name: string
  pid: number
  kids: number[]
  note: string
  ntype: number
  notev: number
}

export const enum EUNIT_TYPE {
  FOLDER = 1,
  BOOK = 2,
}

export const enum ENOTE_TYPE {
  TXT = 1,
  MARKDOWN = 2,
  KEYVALUE = 3,
}

export const enum EMOD_TYPE {
  FULL = 1,
  INFO = 2,
  DELE = 3,
}
