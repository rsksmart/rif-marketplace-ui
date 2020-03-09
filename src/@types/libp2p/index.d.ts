import Multiaddr from 'multiaddr';
import { PeerId } from 'peer-id';
import { PeerInfo } from 'peer-info';

declare module 'libp2p' {
  export default class Libp2p {
    public dht: any;

    /**
     * Dials to the provided peer. If successful, the `PeerInfo` of the
     * peer will be added to the nodes `PeerBook`
     *
     * @param {PeerInfo|PeerId|Multiaddr|string} peer The peer to dial
     * @param {function(Error)} callback
     * @returns {void}
     */
    public dial: (
      peer: PeerInfo | PeerId | Multiaddr | string,
      callback: any,
    ) => void;
    constructor(_options: any);
  }
}
