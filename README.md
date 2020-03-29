# RIF Marketplace - UI

[![CircleCI](https://flat.badgen.net/circleci/github/rsksmart/rif-marketplace-ui/master)](https://circleci.com/gh/rsksmart/rif-marketplace-ui/)
[![Dependency Status](https://david-dm.org/rsksmart/marketplace-ui.svg?style=flat-square)](https://david-dm.org/rsksmart/marketplace-ui)
[![](https://img.shields.io/badge/made%20by-IOVLabs-blue.svg?style=flat-square)](http://iovlabs.org)
[![](https://img.shields.io/badge/project-RIF%20Marketplace-blue.svg?style=flat-square)](https://www.rifos.org/)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
[![Managed by tAsEgir](https://img.shields.io/badge/%20managed%20by-tasegir-brightgreen?style=flat-square)](https://github.com/auhau/tasegir)
![](https://img.shields.io/badge/npm-%3E%3D6.0.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/Node.js-%3E%3D10.0.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/runs%20in-browser%20%7C%20node%20%7C%20webworker%20%7C%20electron-orange)

> Main Website for the RIF Marketplace

**Warning: This project is in alpha state. There might (and most probably will) be changes in the future to its API and working. Also, no guarantees can be made about its stability, efficiency, and security at this stage.**

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Development](#development)
- [Contribute](#contribute)
- [License](#license)

## Install

```sh
git clone git@github.com:rsksmart/rif-communications-chat.git
cd rif-communications-chat
npm install
```

## Usage

```sh
npm run start
```

## Development

To deploy the contracts needed for the marketplace, you can run `npm run deploy:rsk` or `npm run deploy:ganache`. These scripts start their own RSK regtest or ganache network.

If you want to persist the network you can spawn the networks with `npm run network:rsk` or `npm run network:ganache` in a separate terminal window. The deploy script connects to these.

## Contribute

There are some ways you can make this module better:

- Consult our [open issues](https://github.com/rsksmart/rif-marketplace-ui/issues) and take on one of them
- Help our tests reach 100% coverage!

## License

[MIT](./LICENSE)
