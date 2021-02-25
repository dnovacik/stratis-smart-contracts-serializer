import { utils, ValueTypes, isArrayOfBytes, Types, BasicTypes, ArrayTypes } from './utils'

const MAX_SIZE = 56
const OFFSET_SHORT = 0x80
const OFFSET_LONG = 0xb7
const OFFSET_SHORT_LIST = 0xc0
const OFFSET_LONG_LIST = 0xf7

interface Serialize {
  (b: boolean | number | string | bigint | object | Array<ValueTypes>): Buffer
}

interface Deserialize {
  (b: Buffer, type: Types): ValueTypes
}

export const serialize: Serialize = (b: ValueTypes): Buffer => {
  if (Array.isArray(b)) {
    return serializeArray(b)
  }

  switch (typeof (b)) {
    case 'boolean':
      return serializeBoolean(b)
    case 'bigint':
      return serializeBigInt(b)
    case 'number':
      return serializeNumber(b)
    case 'object':
      return serializeObject(b)
    case 'string':
      return b.length === 1
        ? serializeChar(b)
        : Buffer.from(b, 'utf-8')
    default:
      return Buffer.from(b, 'utf-8')
  }
}

export const deserialize: Deserialize = (buffer: Buffer, type: Types): ValueTypes => {
  switch (type) {
    case BasicTypes.BOOLEAN:
      return deserializeBoolean(buffer)
    case BasicTypes.BIGINT:
      return deserializeBigInt(buffer)
    case BasicTypes.NUMBER:
      return deserializeNumber(buffer)
    case BasicTypes.OBJECT:
      return deserializeObject(buffer)
    case BasicTypes.CHAR:
      return deserializeChar(buffer)
    case BasicTypes.STRING:
      return deserializeString(buffer)
    case ArrayTypes.BYTES:
      return deserializeArray<Buffer>(buffer)
    default: return null
  }
}

const serializeChar = (c: string): Buffer => {
  const buffer = Buffer.alloc(2)

  buffer.write(c)

  return buffer
}

const deserializeString = (buffer: Buffer): string => {
  return buffer.length === 2
    ? deserializeChar(buffer)
    : buffer.toString('utf-8')
}

const deserializeChar = (buffer: Buffer): string => {
  return buffer.slice(0, 1).toString('utf-8')
}

const serializeBoolean = (b: boolean): Buffer => {
  return Buffer.from([b ? 1 : 0])
}

const deserializeBoolean = (buffer: Buffer): boolean => {
  const deserialized = buffer.readInt8()

  return deserialized === 1
    ? true
    : false
}

const serializeNumber = (n: number): Buffer => {
  const value = n < 0 ? n >>> 0 : n

  if (n < 0) {
    return serializeBigInt(BigInt(value))
  } else {
    const size = Math.ceil(n.toString().length / 2)
    const buffer = Buffer.alloc(size > 8 ? size : 8)

    buffer.writeInt32LE(value)

    return buffer.slice(0, 4)
  }
}

const deserializeNumber = (buffer: Buffer): number => {
  return buffer.readInt32LE()
}

const serializeBigInt = (b: bigint): Buffer => {
  const size = Math.ceil(b.toString().length / 2)
  const buffer = Buffer.alloc(size > 8 ? size : 8)

  buffer.writeBigInt64LE(b, 0)

  return buffer.slice(0, 4)
}

const deserializeBigInt = (buffer: Buffer): bigint => {
  return buffer.readBigInt64LE()
}

const serializeObject = (o: object): Buffer => {
  const array = new Array<Buffer>()

  for (const value of Object.values(o)) {
    const serialized = serialize(value)
    array.push(encodeValue(serialized))
  }

  return encodeValueArray(array)
}

const deserializeObject = (buffer: Buffer): object => {
  return {}
}

const serializeArray = (array: Array<ValueTypes>): Buffer => {
  const result = new Array<Buffer>()

  if (isArrayOfBytes(array)) {
    return Buffer.concat(array)
  }

  for (const entry of array) {
    const serialized = serialize(entry)
    result.push(encodeValue(serialized))
  }

  return encodeValueArray(result)
}

const deserializeArray = <T>(buffer: Buffer): Array<T> => {
  // if (isArrayOfBytes)
  return []
}

const encodeValue = (buffer: Buffer): Buffer => {
  if (utils.buffer.isNullOrZeroLength(buffer)) {
    return Buffer.from([OFFSET_SHORT])
  }

  if (utils.buffer.isSingleZero(buffer) || utils.buffer.isSingleLessThanOffsetShort(buffer)) {
    return buffer
  }

  if (buffer.length < MAX_SIZE) {
    const length = OFFSET_SHORT + buffer.length
    const result = Buffer.alloc(buffer.length + 1)

    populateBuffer(buffer, result, 1)

    return setFirst(result, length)
  } else {
    const byteLength = utils.buffer.byteNumShifted(buffer)
    const length = buffer.length + 1 + byteLength
    const lenBytes = populateLenBytes(buffer.length, byteLength)
    const result = Buffer.alloc(length)

    populateBuffer(buffer, result, 1 + byteLength)
    populateBuffer(lenBytes, result, lenBytes.length)

    return setFirst(result, OFFSET_LONG + byteLength)
  }
}

const encodeValueArray = (array: Array<Buffer> | null): Buffer => {
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

const getEncodeArrayData = (length: number, byteLength: number): { result: Buffer, offset: number } => {
  if (length < MAX_SIZE) {
    const buffer = Buffer.alloc(length + 1)

    return {
      result: setFirst(buffer, OFFSET_SHORT_LIST + length),
      offset: 1
    }
  } else {
    const lenBytes = populateLenBytes(length, byteLength)
    const buffer = Buffer.alloc(1 + lenBytes.length + length)
    populateBuffer(lenBytes, buffer, 1)

    return {
      result: setFirst(buffer, OFFSET_LONG_LIST + byteLength),
      offset: lenBytes.length + 1
    }
  }
}