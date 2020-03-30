const ERC721SimplePlacements = require('@rsksmart/rif-marketplace-nfts/build/contracts/ERC721SimplePlacements.json');
const ERC20Mintable = require('@rsksmart/rif-marketplace-nfts/build/contracts/ERC20Mintable.json');
const ERC721Mintable = require('@rsksmart/rif-marketplace-nfts/build/contracts/ERC721Mintable.json');
const ERC1820 = require('erc1820');
const ERC677 = require('@rsksmart/rif-marketplace-nfts/build/contracts/ERC677.json');
const ERC777 = require('@rsksmart/rif-marketplace-nfts/build/contracts/ERC777Mintable.json');
const BytesLib = require('@rsksmart/rif-marketplace-nfts/build/contracts/BytesLib.json');

const printBalances = async (web3, accounts) =>
  Promise.all(
    accounts.map(async (acc, i) => {
      const balance = await web3.eth.getBalance(acc);
      console.log(`${i}   ${acc} balance: ${web3.utils.fromWei(balance)}`);
    }),
  );

/**
 * Helper function to deploy a smart contract to the blockchain
 *
 * @param web3      Instance of Web3
 * @param account   Account from which the contract should be deployed
 * @param contract  Compiled contract object to be deployed
 * @param arguments (optional) Array with deployment arguments
 */
const deploy = async (web3, account, contract, arguments = []) => {
  // Need to supply some extra gas
  const gas = await web3.eth.estimateGas({ data: contract.bytecode });
  return new web3.eth.Contract(contract.abi, {
    data: contract.bytecode,
  })
    .deploy({ arguments })
    .send({
      from: account,
      gas: gas + 5000,
      gasPrice: web3.utils.toWei('1', 'gwei'),
    })
    .on('error', function(error) {
      console.log('Error deploying contract', error);
    });
};

/**
 * Deploys all the smart contracts needed
 *
 * @return Returns object with deployed contracts
 */
module.exports = async web3 => {
  const accounts = await web3.eth.getAccounts();
  const defaultToken = web3.utils.sha3('DEFAULT_TOKEN');

  // Create and mint ERC20 token
  const erc20 = await deploy(web3, accounts[0], ERC20Mintable);
  console.log(`ERC20 token (used as DOC) deployed to ${erc20.options.address}`);
  await erc20.methods
    .mint(accounts[0], web3.utils.toBN('1000000000000000000000'))
    .send({
      from: accounts[0],
      gasPrice: web3.utils.toWei('1', 'gwei'),
    });
  console.log(`10^21 ERC20 token (used as DOC) minted`);

  // Create and mint ERC677 token
  const erc677 = await deploy(web3, accounts[0], ERC677, [
    accounts[0],
    web3.utils.toBN('1000000000000000000000'),
    'RIF',
    'RIF',
    web3.utils.toBN('18'),
  ]);
  console.log(`ERC677 token (used as RIF) deployed to ${erc677.options.address}`);

  // Create and mint ERC777 token
  const erc777 = await deploy(web3, accounts[0], ERC777, [
    'ERC 777',
    '777',
    [],
  ]);
  console.log(`ERC777 token (used as DAI) deployed to ${erc777.options.address}`);
  await erc777.methods
    .mint(accounts[0], web3.utils.toBN('1000000000000000000000'))
    .send({
      from: accounts[0],
      gasPrice: web3.utils.toWei('1', 'gwei'),
    });
  console.log(`10^21 ERC777 tokens (used as DAI) minted`);

  // Create RNS token contract
  const erc721 = await deploy(web3, accounts[0], ERC721Mintable);
  console.log(`ERC721 token (NFT we use for RNS) deployed to ${erc721.options.address}`);
  await erc721.methods.mint(accounts[0], defaultToken).send({
    from: accounts[0],
    gasPrice: web3.utils.toWei('1', 'gwei'),
  });

  // Marketplace registry contract
  const erc721SimplePlacements = await deploy(
    web3,
    accounts[0],
    ERC721SimplePlacements,
    [erc677.options.address],
  );
  console.log(
    `ERC721SimplePlacements contract deployed to ${erc721SimplePlacements.options.address}`,
  );

  await erc721SimplePlacements.methods
    .setWhitelistedPaymentToken(erc677.options.address, false, true, false)
    .send({
      from: accounts[0],
    });
  console.log(`ERC677 token (used as RIF) whitelisted for payments`);

  return {
    erc20: erc20.options.address,
    erc677: erc677.options.address,
    erc721: erc721.options.address,
    erc777: erc777.options.address,
    erc721SimplePlacements: erc721SimplePlacements.options.address
  }
};
