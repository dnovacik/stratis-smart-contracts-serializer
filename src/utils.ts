export type ValueTypes = string | number | boolean | bigint | object
export type Types = BasicTypes | ArrayTypes

export enum BasicTypes {
  CHAR = 'char',
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  BIGINT = 'bigint',
  OBJECT = 'object',
}

export enum ArrayTypes {
  BYTES = 'byteArray',
  NUMBERS = 'numberArray',
  STRINGS = 'stringArray',
  CHARS = 'stringArray'
}

const isNullOrZeroLength = (buffer: Buffer): boolean => {
  return buffer === null || buffer.length == 0
}

const isSingleZero = (buffer: Buffer): boolean => {
  return buffer !== null && buffer.length === 1 && buffer[0] === 0
}

const isSingleLessThanOffsetShort = (buffer: Buffer): boolean => {
  return buffer !== null && buffer.length === 1 && buffer[0] < 0x80
}

const byteNumShifted = (buffer: Buffer): number => {
  let temp = buffer.length
  let byteNum = 0

  while (temp !== 0) {
    ++byteNum
    temp = temp >> 8
  }

  return byteNum
}

const isArrayOfType = <T>(elemGuard: (x: any) => x is T) => (arr: any[]): arr is Array<T> => arr.every(elemGuard)
export const isInstanceOf = <T>(ctor: new (...args: any) => T) => (x: any): x is T => x instanceof ctor

export const isArrayOfStrings = isArrayOfType(isInstanceOf(String))
export const isArrayOfBytes = isArrayOfType(isInstanceOf(Buffer))

export const utils = {
  buffer: {
    isNullOrZeroLength,
    isSingleZero,
    isSingleLessThanOffsetShort,
    byteNumShifted
  }
}