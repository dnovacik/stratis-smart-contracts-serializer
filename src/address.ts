import { SmartContractsAddress, ISmartContractsAddress } from "./models";

export class Address implements ISmartContractsAddress {
  zero: Address = new Address()
  width: number = 160 / 8

  pn0: number
  pn1: number
  pn2: number
  pn3: number
  pn4: number

  constructor(other?: SmartContractsAddress) {
    if (other) {
      this.pn0 = other.pn0
      this.pn1 = other.pn1
      this.pn2 = other.pn2
      this.pn3 = other.pn3
      this.pn4 = other.pn4
    } else {
      this.pn0 = 0
      this.pn1 = 0
      this.pn2 = 0
      this.pn3 = 0
      this.pn4 = 0
    }
  }

  fromOther(other: SmartContractsAddress): ISmartContractsAddress {
    return new Address(other)
  }

  // fromBuffer(buffer: Buffer): ISmartContractsAddress {
  //   buffer.slice()
  // }

  toBuffer(): Buffer {
    // const buffer = Buffer.allocUnsafe(this.width)
    // const payload 
    // buffer.copy()

    return Buffer.from([this.pn0, this.pn1, this.pn2, this.pn3, this.pn4])
  }
  toString(): string {
    return this.toBuffer().toString('hex')
  }
}