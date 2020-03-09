declare module 'multihashing-async' {
  import { Multihash } from 'multihash';

  export const multihash: Multihash;

  export const digest: (
    id: any,
    encryptiong: string,
    callback: (err: Error, dhtId: any) => void,
  ) => void;
}
