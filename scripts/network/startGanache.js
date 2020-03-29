/**
 * This files starts ganache network
 */

const logger = require('winston');
const ganacheNetwork = require('./ganacheNetwork');

const BLOCK_TIME = 5;

let ganache;

const start = async () => {
  ganache = await ganacheNetwork(BLOCK_TIME);
  await ganache.waitForStart();
  logger.level = 'debug';
};

process.on('SIGINT', () => {
  if (ganache) {
    console.log('Ganache: shutting down...');
    ganache.close();
  }
  process.exit();
});

start();
