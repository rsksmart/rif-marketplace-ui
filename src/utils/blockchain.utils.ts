import Web3 from 'web3';
const contract = require("@truffle/contract");

const ContractWrapper = (artifact, web3: Web3, from: string) => {
    const c = contract(artifact);
    c.setProvider(web3.currentProvider);
    c.defaults({ from });
    c.setNetwork(web3.eth.net.getId());
    return c;
}

export { ContractWrapper, };
