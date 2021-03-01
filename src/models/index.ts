export type ValueTypes = string | number | boolean | bigint | object
export type Types = BasicTypes | ArrayTypes

export interface Serialize {
  (b: boolean | number | string | bigint | object | Array<ValueTypes>): Buffer
}

export interface Deserialize {
  (b: Buffer, type: Types): ValueTypes
}

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

export interface ISmartContractsAddress extends SmartContractsAddress {
  zero: SmartContractsAddress
  width: number

  fromOther(other: SmartContractsAddress): ISmartContractsAddress

  toBuffer(): Buffer
  toString(): string
}

export interface SmartContractsAddress {
  pn0: number
  pn1: number
  pn2: number
  pn3: number
  pn4: number
}