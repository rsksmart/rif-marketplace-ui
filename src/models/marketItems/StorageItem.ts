import { StorageItemType } from "../Market";


export class StorageItem implements StorageItemType {
    provider!: string;
    size!: number;
    contract_length_months!: number;
    price_per_month!: number;
    currency!: string;
    price_usd!: number;
    _id!: string;
}

export const storageListing: StorageItemType[] = [
  {
    provider: "0xA68c5b2b16e9b6a1FE4f14276dc9B7D0eeA9F808",
    size: 1000000000,
    contract_length_months: 6,
    price_per_month: 18,
    currency: "RIF",
    price_usd: 0.99,
    _id: "0x38EA6CED3289A2AA554986C7662F58F0"
  },
  {
    provider: "0xA68c5b2b16e9b6a1FE4f14276dc9B7D0eeA9F808",
    size: 2000000000,
    contract_length_months: 6,
    price_per_month: 1.2,
    currency: "DOC",
    price_usd: 1.2,
    _id: "0x38EA6CED3289A2AA554986C7662F58F1"
  },
  {
    provider: "0xe664EaB0923724Bb6Bb84878FEF72729A45F0071",
    size: 10000000000,
    contract_length_months: 12,
    price_per_month: 1,
    currency: "DOC",
    price_usd: 1,
    _id: "0x38EA6CED3289A2AA554986C7662F58F2"
  },
  {
    provider: "0x70f1812d3fc4D7A28245c0C91E9cB2CCa7E3d755",
    size: 20000000000,
    contract_length_months: 12,
    price_per_month: 20,
    currency: "RIF",
    price_usd: 1.1,
    _id: "0x38EA6CED3289A2AA554986C7662F58F3"
  },
  {
    provider: "0x01DF838d64ed5030Bd223fFD0969B80Ad2d1D2c7",
    size: 5000000000,
    contract_length_months: 15,
    price_per_month: 0.00015,
    currency: "RBTC",
    price_usd: 0.9,
    _id: "0x38EA6CED3289A2AA554986C7662F58F4"
  },
  {
    provider: "0x2FEE69367C306FC6b5DeabbEf5376f8671f4350b",
    size: 4000000000,
    contract_length_months: 6,
    price_per_month: 1,
    currency: "DOC",
    price_usd: 1,
    _id: "0x38EA6CED3289A2AA554986C7662F58F5"
  },
  {
    provider: "0x03e1B1F94e1055f8E371e3A61b4327f38AffC095",
    size: 1000000000,
    contract_length_months: 3,
    price_per_month: 20,
    currency: "RIF",
    price_usd: 1.1,
    _id: "0x38EA6CED3289A2AA554986C7662F58F6"
  },
  {
    provider: "storagedrive.rsk",
    size: 10000000000,
    contract_length_months: 6,
    price_per_month: 22,
    currency: "RIF",
    price_usd: 1.21,
    _id: "0x38EA6CED3289A2AA554986C7662F58F7"
  },
  {
    provider: "vendorgiga.rsk",
    size: 10000000000,
    contract_length_months: 12,
    price_per_month: 0.00015,
    currency: "RBTC",
    price_usd: 0.9,
    _id: "0x38EA6CED3289A2AA554986C7662F58F8"
  }
]
