/**
 *
 */
const path = require('path');
const mkdirp = require('mkdirp');
const Ganache = require('ganache-cli');
const { utils } = require('web3');

process.on('uncaughtException', console.log);
process.on('unhandledRejection', console.log);

module.exports = async ({ blockTime = 0, quiet = false }) => {
  // create folder to store chain data
  const dbPath = path.join(__dirname, '../../data/ganache');
  mkdirp.sync(dbPath);

  // start networks
  const rskNetwork = Ganache.server({
    total_accounts: 10,
    gasLimit: utils.toHex(6800000),
    mnemonic: 'creek debate assault dash riot butter foster bronze liberty index text stem',
    ws: true,
    seed: 'Ganache is awesome!',
    db_path: dbPath,
    network_id: 88,
    logger: {
      log: val => {
        if (!quiet) console.log('Ganache: ', val);
      },
    },
    blockTime,
  });

  rskNetwork.listen(8545, '127.0.0.1', () => {});
  rskNetwork.waitForStart = () =>
    new Promise((resolve, reject) => {
      if (rskNetwork.listening) {
        resolve();
        return;
      }

      rskNetwork.on('listening', () => resolve());
      rskNetwork.on('close', () => reject(new Error('closed')));
    });

  return rskNetwork;
};
