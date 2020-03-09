// TODO: CHECK THE ACTUAL IMPLEMENTATION AND CREATE RIGHT TYPINGs

declare module 'peer-id' {
  class PeerId {
    public id: CID;
    public privKey: string;
    public pubKey: string;
    public marshalPubKey: () => any;
    public marshalPrivKey: () => any;
    public marshal: (excludePriv?: boolean) => any;
    public toB58String: () => string;
    constructor(id: any, privKey?: any, pubKey?: any);
  }
  class PeerIdWithIs extends PeerId {}
  export const createWithKeyChain: (
    keychain: any,
    keyname: any,
    opts: any,
    callback: (err: Error, peer: PeerId) => void,
  ) => void;

  // export const create: (_options: any) => Promise<PeerId>;
  export const create: (
    _options: any,
    callback: (err: Error, peer: PeerId) => void,
  ) => void;

  export const createFromPubKey: (
    key: string | Buffer,
    callback: (err: Error, peer: PeerId) => void,
  ) => void;

  export const createFromJSON: (
    obj: any,
    callback: (err: Error, peer: PeerId) => void,
  ) => void;

  export const createFromB58String: (str: string) => PeerId;
}
