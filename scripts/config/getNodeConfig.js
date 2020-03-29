/**
 * Get the specific configuration for the blockchain to be used for deployment
 *
 * @param  {String} [NODE_ENV=process.env.NODE_ENV]  Node environment that is being used.
 *
 * @return {Object}          Environment specific configuration that is needed to setup node and deploy
 */
module.exports = (NODE_ENV = process.env.NODE_ENV) => {
  switch (NODE_ENV.toLowerCase()) {
    case 'ganache':
      return {
        network: 'ganache',
        provider: 'http://localhost:8545',
        blockchainDatabase: './data/ganache',
        configFilename: './config/ganache.json',
        nodeId: 88,
      };

    case 'rsk':
      return {
        network: 'rsk',
        provider: 'http://localhost:4444',
        blockchainDatabase: './data/rsk',
        nodeDownloadURL:
          'https://github.com/rsksmart/rskj/releases/download/WASABI-1.3.0/rskj-core-1.3.0-WASABI-all.jar',
        binPath: './scripts/bin/rskj-core-1.3.0-ORCHID-all.jar',
        config: './scripts/config/rsk_node.conf',
        configFilename: './config/rsk.json',
        nodeId: 33,
      };
    default:
      console.error(
        'No network option was selected. Please do so by setting NODE_ENV variable with one of these options: [rsk, ganache]',
      );
  }
  return undefined;
};
