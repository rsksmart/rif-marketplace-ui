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
 - `REACT_APP_NETWORK`: Select the Network to connect (must be defined in `ui-config.json`)

Example:

```
REACT_APP_CACHE_ADDR=http://localhost:3030
REACT_APP_LOG_LEVEL=error
REACT_APP_NETWORK=rskTestnet
```

If you want your own Network configuration, please add it to the config file `src/ui-config.json`.

Example:

```
customAddress": {
    "rif": "0x...",
    "rnsDotRskOwner": "0x...",
    "marketplace": "0x..."
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
