declare module 'eccrypto' {
  export const generatePrivate: () => Buffer;
  export const getPublic: (privateKey: Buffer) => Buffer;
}
