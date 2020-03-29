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
 * Deploy a smart contract to the blockchain
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

module.exports = async web3 => {
  const accounts = await web3.eth.getAccounts();
  const defaultToken = web3.utils.sha3('DEFAULT_TOKEN');

  // const erc20 = await deploy(web3, accounts[0], ERC20Mintable);
  // console.log(`ERC20 token deployed to ${erc20.options.address}`);
  // await erc20.methods
  //   .mint(accounts[1], web3.utils.toBN('1000000000000000000000'))
  //   .send({
  //     from: accounts[0],
  //     gasPrice: web3.utils.toWei('1', 'gwei'),
  //   });

  const erc677 = await deploy(web3, accounts[0], ERC677, [
    accounts[1],
    web3.utils.toBN('1000000000000000000000'),
    'RIF',
    'RIF',
    web3.utils.toBN('18'),
  ]);
  console.log(`ERC677 token deployed to ${erc677.options.address}`);

  // const erc777 = await deploy(web3, accounts[0], ERC777, [
  //   'ERC 721',
  //   '721',
  //   [],
  // ]);
  // console.log(`ERC777 token deployed to ${erc777.options.address}`);
  // await erc777.methods
  //   .mint(accounts[1], web3.utils.toBN('1000000000000000000000'))
  //   .send({
  //     from: accounts[0],
  //     gasPrice: web3.utils.toWei('1', 'gwei'),
  //   });

  const erc721 = await deploy(web3, accounts[0], ERC721Mintable);
  console.log(`ERC721 token deployed to ${erc721.options.address}`);
  await erc721.methods.mint(accounts[0], defaultToken).send({
    from: accounts[0],
    gasPrice: web3.utils.toWei('1', 'gwei'),
  });

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
    .setWhitelistedPaymentToken(erc677.options.address, true, false, false)
    .send({
      from: accounts[0],
    });
  console.log(`ERC677 token whitelisted for payments`);
};
