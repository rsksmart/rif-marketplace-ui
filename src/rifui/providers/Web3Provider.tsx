import React, { Component, createContext } from 'react';
import { getWeb3, EProvider } from '../services/Web3Service';
import Web3 from 'web3';

export { EProvider };

export interface IWeb3Provider {
  state: {
    provider: EProvider | null;
    web3: Web3 | null;
    accounts: string[] | string | null;
    networkName: string | null;
  };
  actions: {
    setProvider: (provider: EProvider) => void;
  };
}

const { Provider, Consumer } = createContext<IWeb3Provider>({
  state: {
    provider: null,
    web3: null,
    accounts: null,
    networkName: null,
  },

  actions: {
    setProvider: () => {},
  },
});

interface IWeb3ProviderProps {}
interface IWeb3ProviderState {
  provider: EProvider | null;
  web3: Web3 | null;
  accounts: string[] | string | null;
  networkName: string | null;
}

const getNetworkName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return 'Ethereum MainNet';
    case 30:
      return 'RSK MainNet';
    default:
      return null;
  }
};

class Web3Provider extends Component<IWeb3ProviderProps, IWeb3ProviderState> {
  constructor(props: IWeb3Provider) {
    super(props);
  }

  public async setProvider(provider: EProvider) {
    try {
      const web3 = await getWeb3(provider);
      const accounts = await web3.eth.getAccounts();
      const chainId = await web3.eth.getChainId();
      this.setState({
        web3,
        provider,
        accounts,
        networkName: getNetworkName(chainId),
      });
    } catch (e) {
      throw e;
    }
  }

  public render() {
    const { provider, web3, accounts, networkName } = this.state;
    const { setProvider } = this;

    return (
      <Provider
        value={{
          actions: {
            setProvider,
          },
          state: {
            provider,
            web3,
            accounts,
            networkName,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export default { Consumer, Provider: Web3Provider };
