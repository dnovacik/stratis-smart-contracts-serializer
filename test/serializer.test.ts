import { BasicTypes } from './../src/models'
import { deserialize, serialize } from './../src/serializer'
import testdata from './test-data'

describe('Serialization', () => {
  describe('Tests.Primitives', () => {
    it('should correctly serialize char to byte array', () => {
      const serializedC = serialize('c').toString('hex')
      const serializedOne = serialize('1').toString('hex')

      expect(serializedC).toBe('6300')
      expect(serializedOne).toBe('3100')
    })

    it('should correctly serialize boolean to byte array', () => {
      const serializedTrueValue = serialize(true).toString('hex')
      const serializedFalseValue = serialize(false).toString('hex')

      expect(serializedTrueValue).toBe('01')
      expect(serializedFalseValue).toBe('00')
    })

    it('should correctly serialize number to byte array', () => {
      const serializedOne = serialize(1).toString('hex')
      const serializedTwo = serialize(2).toString('hex')
      const serializedThree = serialize(175).toString('hex')

      expect(serializedOne).toBe('01000000')
      expect(serializedTwo).toBe('02000000')
      expect(serializedThree).toBe('af000000')
    })

    it('should correctly serialize long number to byte array', () => {
      const serialized = serialize(BigInt(6775492)).toString('hex')

      expect(serialized).toBe('c4626700')
    })

    it('should correctly serialize neg long number to byte array', () => {
      const serialized = serialize(BigInt(-6775492)).toString('hex')

      expect(serialized).toBe('3c9d98ff')
    })

    it('should correctly serialize string to byte array', () => {
      const serialized = serialize('The quick brown fox jumps over the lazy dog').toString('hex')

      expect(serialized).toBe('54686520717569636b2062726f776e20666f78206a756d7073206f76657220746865206c617a7920646f67')
    })
  })

  describe('Tests.Arrays', () => {
    it('should correctly serialize char array to byte array', () => {
      const serialized = serialize(testdata.arrayOfChars).toString('hex')

      expect(serialized).toBe('c9826300826100826200')
    })

    it('should correctly serialize byte array to byte array', () => {
      const serialized = serialize(testdata.arrayOfBytes).toString('hex')

      expect(serialized).toBe('00010203040506070809')
    })

    it('should correctly serialize number array to byte array', () => {
      const serialized = serialize(testdata.arrayOfNumbers).toString('hex')

      expect(serialized).toBe('cf84010000008485ffffff847b000000')
    })

    it('should correctly serialize boolean array to byte array', () => {
      const serialized = serialize(testdata.arrayOfBooleans).toString('hex')

      expect(serialized).toBe('c3000100')
    })

    it('should correctly serialize string array to byte array', () => {
      const serialized = serialize(testdata.arrayOfStrings).toString('hex')

      expect(serialized).toBe('f2845465737480ab54686520717569636b2062726f776e20666f78206a756d7073206f76657220746865206c617a7920646f67')
    })
  })

  describe('Tests.Objects', () => {

  })
})

describe('Deserialization', () => {
  describe('Tests.Primitives', () => {
    it('should correctly deserialize byte array to boolean', () => {
      const deserialized = deserialize(testdata.boolean, BasicTypes.BOOLEAN)

      expect(deserialized).toBe(true)
    })

    it('should correctly deserialize byte array to char', () => {
      const deserialized = deserialize(testdata.char, BasicTypes.CHAR)

      expect(deserialized).toBe('P')
    })

    it('should correctly deserialize byte array to string', () => {
      const deserialized = deserialize(testdata.string, BasicTypes.STRING)

      expect(deserialized).toBe('Test')
    })

    it('should correctly deserialize byte array to number [1]', () => {
      const deserialized = deserialize(testdata.number, BasicTypes.NUMBER)

      expect(deserialized).toBe(12)
    })

    it('should correctly deserialize byte array to number [2]', () => {
      const deserialized = deserialize(testdata.number32b, BasicTypes.NUMBER)

      expect(deserialized).toBe(14)
    })

    it('should correctly deserialize byte array to bigint', () => {
      const deserialized = deserialize(testdata.number128b, BasicTypes.BIGINT)

      expect(deserialized).toBe(BigInt(123456))
    })

    it('should correctly deserialize byte array to 256B int', () => {
      const deserialized = deserialize(testdata.number256b, BasicTypes.BIGINT)

      expect(deserialized).toBe(BigInt(123456))
    })
  })

  describe('Tests.Arrays', () => {

  })
})