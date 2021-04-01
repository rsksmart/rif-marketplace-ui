import Web3 from 'web3'
import networksData from './networks.json'
import ProviderInfo, {
  EProvider,
  getProviderInfo,
} from './models/ProviderInfo'
import ConnectionStatus from './models/Enums'
import NetworkInfo from './models/NetworkInfo'

declare global {
  interface Window {
    ethereum: any // FIXME: This should be properly typed as per metamask
    web3: Web3
  }
}

export function getWeb3(
  provider: EProvider = EProvider.METAMASK,
): Promise<Web3> {
  return new Promise<Web3>((resolve, reject) => {
    switch (provider) {
      // Injected Web3 wallet like MetaMask or Nifty
      case EProvider.NIFTY:
      case EProvider.METAMASK: {
        // New MetaMask
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum)
          window.ethereum
            .enable()
            .then(() => resolve(web3))
            .catch(reject)
        } else if (window.web3) {
          // Older versions of MetaMask or other
          resolve(new Web3(window.web3.currentProvider))
        } else reject(new Error('No injected web3 found'))
        break
      }

      // Localhost
      case EProvider.LOCAL: {
        const localhostProvider = new Web3.providers.HttpProvider(
          "'http://127.0.0.1:4444'",
        )
        resolve(new Web3(localhostProvider))
        break
      }

      // Unknown & not implemented
      default: {
        reject(
          new Error(
            `Provider not implemented or unknown. Chosen provider ${provider}`,
          ),
        )
        break
      }
    }
  })
}

export const getNetworkInfo = (
  networkId: number,
  chainId?: number,
): NetworkInfo | undefined => networksData.find((n) => (chainId
  ? n.networkId === networkId && n.chainId === chainId
  : n.networkId === networkId)) as NetworkInfo

export const getNetworkInfoFromWeb3 = async (
  web3: Web3,
): Promise<NetworkInfo | undefined> => {
  // set networkId and chainId
  let networkId: number | undefined
  let chainId: number | undefined
  try {
    networkId = await web3.eth.net.getId()

    if (networkId) {
      chainId = await web3.eth.getChainId()
    }
  } catch (error) {}
  let networkInfo: NetworkInfo | undefined

  if (networkId) {
    try {
      networkInfo = getNetworkInfo(networkId, chainId)
    } catch (error) {}
  }
  return networkInfo
}

const getWeb3Provider = (): any => {
  // New Metamask
  if (window.ethereum) return window.ethereum

  // Older versions of Metamask or other
  if (window.web3) return window.web3.currentProvider
  return undefined
}

/* eslint-disable complexity */
export const getAvailableProviders = (): ProviderInfo[] | undefined => {
  const result: ProviderInfo[] = []

  const currentProvider = getWeb3Provider()

  if (!currentProvider) return undefined

  if (currentProvider.isMetaMask) {
    // Nifty is also MetaMask
    result.push(
      currentProvider.isNiftyWallet
        ? getProviderInfo(EProvider.NIFTY)
        : getProviderInfo(EProvider.METAMASK),
    )
  }

  if (currentProvider.isTrust) result.push(getProviderInfo(EProvider.TRUST))

  if (currentProvider.isGoWallet) result.push(getProviderInfo(EProvider.GO_WALLET))

  if (currentProvider.isAlphaWallet) result.push(getProviderInfo(EProvider.ALPHA_WALLET))

  if (currentProvider.isStatus) result.push(getProviderInfo(EProvider.STATUS))

  if (currentProvider.isToshi) result.push(getProviderInfo(EProvider.COINBASE))

  // eslint-disable-next-line no-underscore-dangle
  if (typeof (window as any).__CIPHER__ !== 'undefined') result.push(getProviderInfo(EProvider.CIPHER))

  if (currentProvider.constructor.name === 'EthereumProvider') result.push(getProviderInfo(EProvider.MIST))

  if (currentProvider.constructor.name === 'Web3FrameProvider') result.push(getProviderInfo(EProvider.PARITY))

  if (currentProvider.host && currentProvider.host.indexOf('infura') !== -1) result.push(getProviderInfo(EProvider.INFURA))

  if (currentProvider.host && currentProvider.host.indexOf('localhost') !== -1) result.push(getProviderInfo(EProvider.LOCAL))

  return result
}

export const getConnectionStatus = (
  web3?: Web3,
  requiredNetworkId?: number,
  currentNetworkId?: number,
  account?: string,
): ConnectionStatus => {
  if (!web3) return ConnectionStatus.LoggedOut

  if (currentNetworkId !== requiredNetworkId) {
    return ConnectionStatus.WrongNetwork
  }

  if (account) {
    return ConnectionStatus.LoggedIn
  }
  return ConnectionStatus.WalletLocked
}
