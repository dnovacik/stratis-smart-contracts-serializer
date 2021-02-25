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