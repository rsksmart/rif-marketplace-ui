declare module 'multiaddr' {
  export default class Multiaddr {
    constructor(addr?: Multiaddr | null | string | Buffer);
  }
}
