import React from 'react';
import { Account } from 'rifui';
import { IButtonProps } from 'rifui/components/atoms/buttons/Button';
import Web3Provider from 'rifui/providers/Web3Provider';

const Login = (props: IButtonProps) => (
    <Web3Provider.Consumer>
        {({ state: { web3, networkName, account }, actions: { setProvider } }) => (
            <Account
                web3={web3}
                networkName={networkName}
                account={account}
                setProvider={setProvider}
                {...props}
            />
        )}
    </Web3Provider.Consumer>
);

export default Login;