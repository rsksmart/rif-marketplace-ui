const Confirm = require('prompt-confirm');
const fs = require('fs');

const getNodeConfig = require('./config/getNodeConfig');
const getWeb3 = require('./network/getNetwork');
const deployContracts = require('./deploy/deployContracts');

async function deployProcess() {
  const config = getNodeConfig(process.env.NODE_ENV);

  // No configuration was found
  if (!config) process.exit();

  // Get web3 provider and default accounts
  const { web3, accounts, child } = await getWeb3(config);

  console.log('Using accounts:\n', accounts, '\n');

  // Deploy all the contracts
  const {
    erc20,
    erc677,
    erc721,
    erc777,
    erc721SimplePlacements,
  } = await deployContracts(web3);

  if (child) {
    console.log(`Stopping the child node process`);
    child.kill('SIGINT');
  }

  const configuration = {
    REACT_APP_DOC: erc20,
    REACT_APP_RIF: erc677,
    REACT_APP_DAI: erc777,
    REACT_APP_RNS: erc721,
    REACT_APP_MARKETPLACE_TCR: erc721SimplePlacements,
  };

  const queryWriteConfiguration = await new Confirm(
    'Write the configuration files?',
  ).run();
  if (queryWriteConfiguration) {
    const out = Object.entries(configuration).map(([k, e]) => `${k}=${e}`);
    await fs.writeFileSync('.env', out.join('\n'));
  }

  process.exit();
}

deployProcess();
