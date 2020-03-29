const fs = require('fs');
const { spawn } = require('child_process');
const download = require('../utils/download');
const getNodeConfig = require('../config/getNodeConfig');

process.on('uncaughtException', console.log);
process.on('unhandledRejection', console.log);

module.exports = async (config = getNodeConfig('rsk')) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!fs.existsSync(config.binPath)) {
        console.log('Downloading RSK jar file');
        await download(config.nodeDownloadURL, config.binPath);
      }

      console.log('Starting RSK regtest');
      const child = await spawn('java', [
        `-Drsk.conf.file=${config.config}`,
        `-jar`,
        `${config.binPath}`,
        `co.rsk.Start`,
        `--regtest`,
      ]);
      resolve(child);
    } catch (e) {
      reject(e);
    }
  });
