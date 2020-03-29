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
  await deployContracts(web3);

  process.exit();
}

deployProcess();
