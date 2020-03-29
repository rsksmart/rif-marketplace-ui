const Web3 = require('web3');
const ganacheNetwork = require('./ganacheNetwork');
const getNodeConfig = require('../config/getNodeConfig');
const Confirm = require('prompt-confirm');
const rskNetwork = require('./RSKNetwork');

/**
 * Sleep for number of ms
 *
 * @param  {number} ms Sleep time in miliseconds
 * @return {Promise}   Resolves once given period is satisfied
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Repeatedly try and connect to the provider with a timeout
 *
 * @param  {String} provider         Web3 provider URL to connect to
 * @param  {Number} [tries=10]       How many tries to connect should be tried
 * @param  {Number} [sleepTime=1000] Interval between tries
 *
 * @return {Promise}                 On success resolves to web3 provider and list of accounts using getAccounts()
 */
function tryAndConnectRepeatedly(provider, tries = 60, sleepTime = 1000) {
  let web3;
  let accounts;

  return new Promise(async (resolve, reject) => {
    for (let i = tries; i > 0; i -= 1) {
      try {
        await sleep(sleepTime); // eslint-disable-line no-await-in-loop
        console.log(`Attempting to connect to the web3 provider ${provider}`);
        web3 = new Web3(provider);
        accounts = await web3.eth.getAccounts(); // eslint-disable-line no-await-in-loop

        console.log(`Successfully connected to ${provider}\n`);
        resolve({ web3, accounts });
        break;
      } catch (er) {
        console.log(`Connection failed, will attempt ${i} more time${i > 1 ? 's' : ''}`);
      }
    }
    reject();
  });
}

/**
 */
module.exports = function getWeb3(config = getNodeConfig()) {
  let web3;
  let accounts;
  let child;
  return new Promise(async (resolve, reject) => {
    try {
      // Try and connect to the web3 provider
      console.log(`Attempting to connect to the web3 provider ${config.provider}`);
      web3 = new Web3(config.provider);
      if (config.private_keys) {
        const acc = await Promise.all(
          config.private_keys.map(pk => web3.eth.accounts.privateKeyToAccount(pk)),
        );
        await Promise.all(acc.map(a => web3.eth.accounts.wallet.add(a)));
        accounts = acc.map(a => a.address);
      } else accounts = await web3.eth.getAccounts();

      resolve({ web3, accounts, spawned: false });
    } catch (e) {
      // Unable to connect to the web3 provider, ask the user if they wish to spawn new one
      console.log('\n');
      const queryStartNetwork = await new Confirm(
        `Unable to connect to the provider at ${config.provider}, can we spawn one?`,
      ).run();

      if (queryStartNetwork) {
        switch (config.network) {
          case 'rsk':
            child = await rskNetwork();
            break;
          case 'ganache':
            await (await ganacheNetwork({ quiet: true })).waitForStart();
            console.log('Ganache server started');
            break;
          default:
            reject(new Error(`Unknown option provided to spawn web3 instance ${config.network}`));
            break;
        }
      }

      try {
        const connection = await tryAndConnectRepeatedly(config.provider);

        resolve({ web3: connection.web3, accounts: connection.accounts, child, spawned: true });
      } catch (er) {
        console.error(`Unable to connect to the provider at ${config.provider}`);
        reject(er);
        process.exit();
      }
    }
  });
};
