import { ValueTypes, Types, BasicTypes, ArrayTypes, Deserialize, Serialize } from './models'
import { isArrayOfBytes } from './utils'
import { encodeValue, encodeValueArray } from './encoder'

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
  //TODO
  // if (isArrayOfBytes)
  return []
}