import { serialize } from './../src/serializer'

export default {
  arrayOfBytes: [
    Buffer.from([0]),
    Buffer.from([1]),
    Buffer.from([2]),
    Buffer.from([3]),
    Buffer.from([4]),
    Buffer.from([5]),
    Buffer.from([6]),
    Buffer.from([7]),
    Buffer.from([8]),
    Buffer.from([9]),
  ],
  arrayOfBooleans: [
    false,
    true,
    false
  ],
  arrayOfChars: [
    'c',
    'a',
    'b'
  ],
  arrayOfStrings: [
    "Test",
    "",
    "The quick brown fox jumps over the lazy dog"
  ],
  arrayOfNumbers: [
    1,
    -123,
    123
  ],
  boolean: Buffer.from('01', 'hex'),
  char: serialize('P'),
  string: Buffer.from('54657374', 'hex'),
  number: Buffer.from('0c000000', 'hex'),
  number32b: Buffer.from('0e00000000000000', 'hex'),
  number128b: Buffer.from('40e20100000000000000000000000000', 'hex'),
  number256b: Buffer.from('40e2010000000000000000000000000000000000000000000000000000000000', 'hex')
}