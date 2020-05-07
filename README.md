# RIF Marketplace - UI

> Main Website for the RIF Marketplace

\*\*Warning: This project is in alpha state.

## Install

Download and setup the RIF Marketplace UI
```
git clone git@github.com:rsksmart/rif-marketplace-ui.git

cd rif-marketplace-ui
```

Install the dependencies

```
npm i
```

Setup `.env` file with the following configuration:

 - `REACT_APP_CACHE_ADDR` : Cache connection URI
 - `REACT_APP_LOG_LEVEL`: React logging level
 - `REACT_APP_NETWORK`: Network Identified (should be defined in `ui-config.json`) 
 
Example:

```
REACT_APP_CACHE_ADDR=http://cacheserver:3030   
REACT_APP_LOG_LEVEL=error
REACT_APP_NETWORK=rskTestnet
```

Setup config file `ui-config.json` which contains the required Contract addresses for all networks. 

- RNS related:
    -  `rif`: address of the deployed RIF token contract
    - `rnsDotRskOwner` : address of the deployed RNS Owner contract 
    - `rnsNameResolver`: address of the deployed RNS Name resolver contract
    - `marketplace`: address of the deployed NFTS Marketplace contract

Example:

```
"regtest": {
    "rif": "0x67B5656d60a809915323Bf2C40A8bEF15A152e3e",
    "rnsDotRskOwner": "0x4bf749ec68270027C5910220CEAB30Cc284c7BA2",
    "rnsNameResolver": "0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7",
    "marketplace": "0x22d5C8BdD4346b390014a07109a8F830094d4abf"
  }
```

Run the UI (Will be available on http://localhost:3000/)
```
npm start
```


## Usage

To setup the complete Development environment please see [Rif Marketplace Dev](https://github.com/rsksmart/rif-marketplace-dev#local-development-environment-for-rif-marketplace-services) project.


## Contribute

There are some ways you can make this module better:

- Consult our [open issues](https://github.com/rsksmart/rif-marketplace-ui/issues) and take on one of them
- Help our tests reach 100% coverage!

## License

[MIT](./LICENSE)
