const contract = require('@truffle/contract');
const RNSSuite = require('@rsksmart/rns-suite');

const ERC721SimplePlacements = require('@rsksmart/rif-marketplace-nfts/build/contracts/ERC721SimplePlacements.json');
const ERC20Mintable = require('@rsksmart/rif-marketplace-nfts/build/contracts/ERC20Mintable.json');
const BytesLib = require('@rsksmart/rif-marketplace-nfts/build/contracts/BytesLib.json');

function ContractWrapper(artifact, web3, from) {
  const c = contract(artifact);
  c.setProvider(web3.currentProvider);
  c.defaults({ from });
  c.setNetwork(web3.eth.net.getId());
  return c;
}

/**
 * Deploys all the smart contracts needed
 *
 * @return Returns object with deployed contracts
 */
module.exports = async web3 => {
  const accounts = await web3.eth.getAccounts();
  const tokenCount = '1000000';
  const rnsDomainNames = ['alice', 'bob', 'charlie'];

  // Simple wrapper so that the web3 and default account don't need to be repeated
  const Contract = function(c) {
    return ContractWrapper(c, web3, accounts[0]);
  };

  const rnsContracts = await RNSSuite(web3.currentProvider, rnsDomainNames);

  // Create and mint ERC20 token
  const erc20 = await Contract(ERC20Mintable).new();
  console.log(`ERC20 token (used as DOC) deployed to ${erc20.address}`);

  await erc20.mint(accounts[1], web3.utils.toWei(tokenCount));
  console.log(`${tokenCount} ERC20 token (used as DOC) minted`);

  const bytesLib = await Contract(BytesLib).new();
  console.log(`BytesLib deployed ${bytesLib.address}`);

  // Marketplace registry contract
  const MarketplaceContract = Contract(ERC721SimplePlacements);
  await MarketplaceContract.link('BytesLib', bytesLib.address);
  console.log(`BytesLib linked to Marketplace Contract`);

  const marketplace = await MarketplaceContract.new(
    rnsContracts.rskOwner.options.address,
  );
  console.log(
    `ERC721SimplePlacements contract deployed to ${marketplace.address}`,
  );

  await marketplace.setWhitelistedPaymentToken(
    rnsContracts.rif.address,
    false,
    true,
    false,
  );

  return {
    erc20: erc20.address,
    rif: rnsContracts.rif.options.address,
    rns: rnsContracts.rskOwner.options.address,
    marketplace: marketplace.address,
  };
};
