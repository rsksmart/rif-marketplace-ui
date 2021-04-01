import { metaMaskIconImg, niftyIconImg } from '@rsksmart/rif-ui'

export default interface ProviderInfo {
  name: string
  eProvider: EProvider
  iconImg?: string
}

export enum EProvider {
  METAMASK = 'Metamask',
  NIFTY = 'Nifty',
  LEDGER = 'Ledger',
  TREZOR = 'Trezor',
  TRUST = 'Trust',
  LOCAL = 'Localhost',
  GO_WALLET = 'GoWallet',
  ALPHA_WALLET = 'AlphaWallet',
  STATUS = 'status',
  CIPHER = 'cipher',
  COINBASE = 'coinbase',
  MIST = 'mist',
  PARITY = 'parity',
  INFURA = 'infura'
}

export const getProviderInfo = (eProvider: EProvider): ProviderInfo => {
  switch (eProvider) {
    case EProvider.METAMASK:
      return {
        name: 'MetaMask',
        eProvider,
        iconImg: metaMaskIconImg,
      }
    case EProvider.NIFTY:
      return {
        name: 'Nifty',
        eProvider,
        iconImg: niftyIconImg,
      }
    case EProvider.LEDGER:
      return {
        name: 'Ledger',
        eProvider,
      }
    case EProvider.TREZOR:
      return {
        name: 'Trezor',
        eProvider,
      }
    case EProvider.TRUST:
      return {
        name: 'Trust',
        eProvider,
      }
    case EProvider.GO_WALLET:
      return {
        name: 'Go Wallet',
        eProvider,
      }
    case EProvider.ALPHA_WALLET:
      return {
        name: 'Alpha Wallet',
        eProvider,
      }
    case EProvider.STATUS:
      return {
        name: 'Status',
        eProvider,
      }
    case EProvider.COINBASE:
      return {
        name: 'Coinbase',
        eProvider,
      }
    case EProvider.MIST:
      return {
        name: 'Mist',
        eProvider,
      }
    case EProvider.PARITY:
      return {
        name: 'Parity',
        eProvider,
      }
    case EProvider.INFURA:
      return {
        name: 'Infura',
        eProvider,
      }
    case EProvider.LOCAL:
      return {
        name: 'Localhost',
        eProvider,
      }
    default: {
      throw new Error(
        `EProvider not implemented or unknown. Chosen provider ${eProvider}`,
      )
    }
  }
}
