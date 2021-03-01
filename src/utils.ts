import { MAX_SIZE, OFFSET_LONG, OFFSET_LONG_LIST, OFFSET_SHORT, OFFSET_SHORT_LIST } from './constants'

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

const populateBuffer = (source: Buffer, target: Buffer, offset: number): void => {
  source.copy(target, offset)
}

const setFirst = (buffer: Buffer, first: number): Buffer => {
  buffer[0] = first

  return buffer
}

const populateLenBytes = (sourceLength: number, byteNum: number): Buffer => {
  const buffer = Buffer.alloc(byteNum)

  for (let i = 0; i < byteNum; ++i) {
    buffer[byteNum - 1 - i] = (sourceLength >> (8 * i))
  }

  return buffer
}

const isBiggerThan55Bytes = (buffer: Buffer, currentPosition: number): boolean => {
  return buffer[currentPosition] > OFFSET_LONG_LIST
}

const isLessThan55Bytes = (buffer: Buffer, currentPosition: number): boolean => {
  return buffer[currentPosition] >= OFFSET_SHORT_LIST && buffer[currentPosition] <= OFFSET_LONG_LIST
}

const isItemBiggerThan55Bytes = (buffer: Buffer, currentPosition: number): boolean => {
  return buffer[currentPosition] > OFFSET_LONG && buffer[currentPosition] < OFFSET_SHORT_LIST
}

const isItemLessThan55Bytes = (buffer: Buffer, currentPosition: number): boolean => {
  return buffer[currentPosition] > OFFSET_SHORT && buffer[currentPosition] <= OFFSET_LONG
}

const isNullItem = (buffer: Buffer, currentPosition: number): boolean => {
  return buffer[currentPosition] === OFFSET_SHORT
}

const isSingleByteItem = (buffer: Buffer, currentPosition: number): boolean => {
  return buffer[currentPosition] < OFFSET_SHORT
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
    byteNumShifted,
    populateBuffer,
    setFirst,
    populateLenBytes,
    isBiggerThan55Bytes,
    isLessThan55Bytes,
    isItemBiggerThan55Bytes,
    isItemLessThan55Bytes,
    isNullItem,
    isSingleByteItem
  }
}