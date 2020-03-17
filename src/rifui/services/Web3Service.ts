import Web3 from 'web3';

declare global {
  interface Window {
    ethereum: any; // FIXME: This should be properly typed as per metamask
    web3: Web3;
  }
}

export enum EProvider {
  METAMASK = 'Metamask',
  LEDGER = 'Ledger',
  TREZOR = 'Trezor',
  LOCAL = 'Localhost',
}

export function getWeb3(provider: EProvider = EProvider.METAMASK) {
  return new Promise<Web3>(async (resolve, reject) => {
    switch (provider) {
      // Injected Web3 wallet like MetaMask
      case EProvider.METAMASK: {
        // New MetaMask
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          try {
            await window.ethereum.enable();
            resolve(web3);
          } catch (error) {
            reject(error);
          }
        }
        // Older versions of MetaMask or other
        else if (window.web3) {
          resolve(new Web3(window.web3.currentProvider));
        } else reject(new Error('No injected web3 found'));
        break;
      }

      // Localhost
      case EProvider.LOCAL: {
        const provider = new Web3.providers.HttpProvider(
          "'http://127.0.0.1:4444'",
        );
        resolve(new Web3(provider));
        break;
      }

      // Unknown & not implemented
      default: {
        reject(
          new Error(
            `Provider not implemented or unknown. Chosen provider ${provider}`,
          ),
        );
        break;
      }
    }
  });
}
