# RIF Marketplace - UI

> Main Website for the RIF Marketplace

**Warning: This project is in alpha state. There might (and most probably will) be changes in the future to its working. Also, no guarantees can be made about its stability, efficiency, and security at this stage.**

## Lead Maintainer

[Juraj Piar](https://github.com/jurajpiar)

See what "Lead Maintainer" means [here](https://github.com/rsksmart/lead-maintainer).

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

## Acknowledgements

- Our `Uncaught Error` page was inspired by [Kapwing](https://www.kapwing.com/404-illustrations). Check out their great work!
