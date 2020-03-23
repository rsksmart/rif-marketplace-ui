import { DomainItemType } from '../Market';

export class DomainItem implements DomainItemType {
    currency!: string;
    domain!: string;
    price_usd!: number;
    price!: number;
    tld!: string;
    user!: string;
    _id!: string;
}

export const domainListing: DomainItemType[] = [
  {
    tld: ".rsk",
    domain: "server.rsk",
    price: 20,
    currency: "RIF",
    price_usd: 1.1,
    _id: '0x38EA6CED3289A2AA554986C7662F58F0',
    user: '38EA6CED3289A2AA554986C7662F58F0'
  },
  {
    tld: ".rsk",
    domain: "inbox.rsk",
    price: 1,
    currency: "DOC",
    price_usd: 1,
    _id: '38EA6CED3289A2AA554986C7662F58F1',
    user: '38EA6CED3289A2AA554986C7662F58F1'
  },
  {
    tld: ".rsk",
    domain: "myapps.rsk",
    price: 25,
    currency: "RIF",
    price_usd: 1.375,
    _id: '38EA6CED3289A2AA554986C7662F58F2',
    user: '38EA6CED3289A2AA554986C7662F58F2'
  },
  {
    tld: ".rsk",
    domain: "defi.rsk",
    price: 0.2,
    currency: "RBTC",
    price_usd: 3,
    _id: '38EA6CED3289A2AA554986C7662F58F3',
    user: '38EA6CED3289A2AA554986C7662F58F3'
  },
  {
    tld: ".rsk",
    domain: "cloudstore.rsk",
    price: 0.1,
    currency: "RBTC",
    price_usd: 3,
    _id: '38EA6CED3289A2AA554986C7662F58F4',
    user: '38EA6CED3289A2AA554986C7662F58F4'
  },
  {
    tld: ".rsk",
    domain: "upload.rsk",
    price: 15,
    currency: "RIF",
    price_usd: 0.825,
    _id: '38EA6CED3289A2AA554986C7662F58F5',
    user: '38EA6CED3289A2AA554986C7662F58F5'
  },
  {
    tld: ".rsk",
    domain: "toolsdefi.rsk",
    price: 0.5,
    currency: "RBTC",
    price_usd: 3,
    _id: '38EA6CED3289A2AA554986C7662F58F6',
    user: '38EA6CED3289A2AA554986C7662F58F6'
  },
  {
    tld: ".rsk",
    domain: "sotfware.rsk",
    price: 0.5,
    currency: "RBTC",
    price_usd: 3,
    _id: '38EA6CED3289A2AA554986C7662F58F7',
    user: '38EA6CED3289A2AA554986C7662F58F7'
  },
  {
    tld: ".iov",
    domain: "onlinesite.iov",
    price: 5,
    currency: "DOC",
    price_usd: 5,
    _id: '38EA6CED3289A2AA554986C7662F58F8',
    user: '38EA6CED3289A2AA554986C7662F58F8'
  },
  {
    tld: ".iov",
    domain: "redirect.iov",
    price: 2,
    currency: "DOC",
    price_usd: 2,
    _id: '38EA6CED3289A2AA554986C7662F58F9',
    user: '38EA6CED3289A2AA554986C7662F58F9'
  },
  {
    tld: ".iov",
    domain: "finance.iov",
    price: 10,
    currency: "RIF",
    price_usd: 0.55,
    _id: '38EA6CED3289A2AA554986C7662F58FA',
    user: '38EA6CED3289A2AA554986C7662F58FA'
  }
]