import React, { Component, createContext } from 'react';
import { getWeb3, EProvider } from '../services/Web3Service';
import Web3 from 'web3';

export { EProvider };

export interface IWeb3Provider {
  state: {
    provider: EProvider | null;
    web3: Web3 | null;
    account: string | null;
    networkName: string | null;
  };
  actions: {
    setProvider: (provider: EProvider) => void;
  };
}

const defaultState = {
  provider: null,
  web3: null,
  account: null,
  networkName: null,
};

export const Web3Store = createContext<IWeb3Provider>({
  state: defaultState,
  actions: {
    setProvider: () => { },
  },
});

interface IWeb3ProviderProps { }
interface IWeb3ProviderState {
  provider: EProvider | null;
  web3: Web3 | null;
  account: string | null;
  networkName: string | null;
}

const getNetworkName = (networkId: number) => {
  switch (networkId) {
    case 1:
      return 'Ethereum';
    case 3:
      return 'Ropsten';
    case 4:
      return 'Rinkeby';
    case 5:
      return 'Goerli';
    case 30:
      return 'RSK MainNet';
    case 31:
      return 'RSK TestNet';
    case 42:
      return 'Kovan';
    case 61:
      return 'Ethereum Classic';
    case 99:
      return 'POA Core';
    case 100:
      return 'xDai';
    default:
      return null;
  }
};

class Web3Provider extends Component<IWeb3ProviderProps, IWeb3ProviderState> {
  constructor(props: IWeb3Provider) {
    super(props);

    this.state = defaultState;

    this.setProvider = this.setProvider.bind(this);
  }

  public async setProvider(provider: EProvider) {
    try {
      const web3 = await getWeb3(provider);
      const accounts = await web3.eth.getAccounts();
      let account: string;
      if (Array.isArray(accounts)) account = accounts[0];
      else account = accounts;
      let networkId = await web3.eth.net.getId();
      if (networkId === 1) networkId = await web3.eth.getChainId();
      this.setState({
        web3,
        provider,
        account,
        networkName: getNetworkName(networkId),
      });
    } catch (e) {
      throw e;
    }
  }

  public render() {
    const { provider, web3, account, networkName } = this.state;
    const { setProvider } = this;

    return (
      <Web3Store.Provider
        value={{
          actions: {
            setProvider,
          },
          state: {
            provider,
            web3,
            account,
            networkName,
          },
        }}
      >
        {this.props.children}
      </Web3Store.Provider>
    );
  }
}

export default { Consumer: Web3Store.Consumer, Provider: Web3Provider };
