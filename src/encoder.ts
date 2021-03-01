import { MAX_SIZE, OFFSET_LONG, OFFSET_LONG_LIST, OFFSET_SHORT, OFFSET_SHORT_LIST } from './constants'
import { utils } from './utils'

export const encodeValue = (buffer: Buffer): Buffer => {
  if (utils.buffer.isNullOrZeroLength(buffer)) {
    return Buffer.from([OFFSET_SHORT])
  }

  if (utils.buffer.isSingleZero(buffer) || utils.buffer.isSingleLessThanOffsetShort(buffer)) {
    return buffer
  }

  if (buffer.length < MAX_SIZE) {
    const length = OFFSET_SHORT + buffer.length
    const result = Buffer.alloc(buffer.length + 1)

    utils.buffer.populateBuffer(buffer, result, 1)

    return utils.buffer.setFirst(result, length)
  } else {
    const byteShifted = utils.buffer.byteNumShifted(buffer)
    const length = buffer.length + 1 + byteShifted
    const lenBytes = utils.buffer.populateLenBytes(buffer.length, byteShifted)
    const result = Buffer.alloc(length)

    utils.buffer.populateBuffer(buffer, result, 1 + byteShifted)
    utils.buffer.populateBuffer(lenBytes, result, lenBytes.length)

    return utils.buffer.setFirst(result, OFFSET_LONG + byteShifted)
  }
}

export const encodeValueArray = (array: Array<Buffer> | null): Buffer => {
  if (!array) {
    return Buffer.from([OFFSET_SHORT_LIST])
  }

  const fullLength = array.reduce((a, b) => a + b.length, 0)
  const byteLength = array.reduce((a, b) => a + utils.buffer.byteNumShifted(b), 0)

  let { result, offset } = getEncodeArrayData(fullLength, byteLength)

  array.forEach(item => {
    item.copy(result, offset)
    offset += item.length
  })

  return result
}

const getEncodeArrayData = (length: number, byteLength: number): { result: Buffer, offset: number } => {
  if (length < MAX_SIZE) {
    const buffer = Buffer.alloc(length + 1)

    return {
      result: utils.buffer.setFirst(buffer, OFFSET_SHORT_LIST + length),
      offset: 1
    }
  } else {
    const lenBytes = utils.buffer.populateLenBytes(length, byteLength)
    const buffer = Buffer.alloc(1 + lenBytes.length + length)
    utils.buffer.populateBuffer(lenBytes, buffer, 1)

    return {
      result: utils.buffer.setFirst(buffer, OFFSET_LONG_LIST + byteLength),
      offset: lenBytes.length + 1
    }
  }
}

export const decode = (buffer: Buffer): Buffer => {
  //TODO
  return Buffer.from('x')
}

export const decodeValue = (buffer: Buffer, level: number, startPosition: number,
  endPosition: number, levelToIndex: number, collection: Array<Buffer>): void => {
  if (utils.buffer.isNullOrZeroLength(buffer)) {
    return;
  }

  const currentData = Buffer.alloc(endPosition - startPosition)
  buffer.copy(currentData, 0, startPosition, currentData.length)

  //TODO
  try {
    let currentPosition = startPosition

    while (currentPosition < endPosition) {

    }
  } catch (e) {
    throw new Error(`Invalid data ${currentData.toString('hex')}`)
  }
}