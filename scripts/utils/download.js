const fs = require('fs');
const download = require('download');
const path = require('path');
const mkdirp = require('mkdirp');

/**
 * Download a file frome URL and save it to provided filename with path
 *
 * @param  {string}  url          URL of the source files
 * @param  {string}  pathFilename Filename and path to which the file should be stored
 *
 * @return {Promise}              Resolves if the file was downloaded and saved correctly
 */
module.exports = async (url, pathFilename) =>
  new Promise(async (resolve, reject) => {
    try {
      // Download the data from remote URL
      const data = await download(url);

      // Make the directory structure if it does not exist
      mkdirp.sync(path.dirname(pathFilename));

      // Write the downloaded data
      await fs.writeFileSync(pathFilename, data);

      resolve();
    } catch (e) {
      reject(e);
    }
  });
