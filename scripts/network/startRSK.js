/**
 * This files starts ganache network
 */

const rskNetwork = require('./RSKNetwork');

let rsk;

const start = async () => {
  rsk = await rskNetwork();
  console.log(
    'RSK regtest started, it may take up to 10 seconds for the node to start',
  );
};

process.on('SIGINT', () => {
  if (rsk) rsk.kill('SIGINT');
  process.exit();
});
process.on('SIGTERM', () => {
  if (rsk) rsk.kill('SIGINT');
  process.exit();
});

start();
