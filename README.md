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
"rskTestnet": {
    "rif": "0x19f64674D8a5b4e652319F5e239EFd3bc969a1FE",
    "rnsDotRskOwner": "0xca0a477e19bac7e0e172ccfd2e3c28a7200bdb71",
    "rnsNameResolver": "0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7",
    "marketplace": "0x8587385ad60038bB181aFfDF687c4D1B80C4787e"
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
