# RIF Marketplace - UI

> Main Website for the RIF Marketplace

\*\*Warning: This project is in alpha state.

### Table of content:
- [Dependencies](#dependencies)
    - [Prerequisities](#prerequisities)
    - [Part of tutorial](#part-of-tutorial)
- Setup
    1. Developers Environment
        1.1. Starting docker
        1.2. Deploying smart contracts
        1.3. Browser wallet
    2. RIF Marketplace Cache
    3. RIF Marketplace UI
    4. RNS Manager
- Using the RIF Marketplace
    - Registering domains using RNS
    - Selling domain
    - Buying domain
- Troubleshooting

# Dependencies
## Prerequisities
0. node v10 (or [nvm](https://github.com/nvm-sh/nvm) with node v10 installed)
1. [Docker](https://www.docker.com/)

## Part of tutorial
These will be installed during the tutorial

3. [RIF Marketplace Developer Environment](https://github.com/rsksmart/rif-marketplace-dev/) project
4. [RIF Marketplace Cache](https://github.com/rsksmart/rif-marketplace-cache/tree/feat/rns-entities) project's [`feat/rns-entities`](https://github.com/rsksmart/rif-marketplace-cache/tree/feat/rns-entities) branch
5. [RIF Marketplace UI](https://github.com/rsksmart/rif-marketplace-ui/tree/feature/buyRnsBlcChn) project's [`feature/buyRnsBlcCHn`](https://github.com/rsksmart/rif-marketplace-ui/tree/feature/buyRnsBlcChn) branch
6. [RNS Manager Project](https://github.com/rnsdomains/rns-manager-react)

# Setup:
## 1. Developers Environment
Download and setup the RIF Marketplace Developer Environment
```
git clone git@github.com:rsksmart/rif-marketplace-dev.git

cd rif-marketplace-dev
```

### 1.1. Starting docker
Now you can start docker with
```
docker-compose up
```

The following services will now run:
- Postgres DB
- Admin interface for Postgres on http://localhost:8080
- Ganache blockchain 


### 1.2. Deploying smart contracts
First, install the dependencies (make sure to **use node v10**, you can switch using `nvm use 10`)

```
sh install.sh
```

Run the deployment script for the RNS and Marketplace contracts deploying to ganache network
```
sh deploy.sh
```

This will create `./out` folder with a number of configuration files

### 1.3. Browser wallet
In MetaMask or Nifty import the first address from `keys.txt` file. The private key is `0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d`

Connect to the local ganache network (Localhost 8545 in the network dropdown). You should now see a balance of 99 ETH (or close to that - some gas was already used to deploy the Contracts)

Now we will add RIF token. Click on `Add Token` -> `Custom Token` and input the token address that is in `./out/ui-config.json` under the `rif` attribute (should be `0x67B5656d60a809915323Bf2C40A8bEF15A152e3e` if this is your first deployment). You should now see your RIF tokens balance of 997 RIF.

You can similarly add more accounts to your wallet if needed.

## 2. RIF Marketplace Cache
Download and setup the RIF Marketplace Cache
```
git clone git@github.com:rsksmart/rif-marketplace-cache.git

cd rif-marketplace-cache

git checkout feat/rns-entities
```

Install the dependencies

```
npm i
```

Copy the configuration file generated in step [1.2](#1.2.Deploying-smart-contracts) from `rif-marketplace-dev/out/cache-ganache-config.json` into `rif-marketplace-cache/config/local.json`.

Run the cache with
```
npm run bin -- start --enable rns --log=debug
```

## 3. RIF Marketplace UI
Download and setup the RIF Marketplace UI
```
git clone git@github.com:rsksmart/rif-marketplace-ui.git

cd rif-marketplace-ui

git checkout feature/buyRnsBlcChn
```

Install the dependencies

```
npm i
```

Copy the configuration file generated in step [1.2](#1.2.Deploying-smart-contracts) from `rif-marketplace-dev/out/ui-config.json` into `rif-marketplace-ui/src/ui-config.json`. (You should replace the file if already exists)

Run the UI (Will be available on http://localhost:3000/)
```
npm start
```


## 4. RNS Manager
Download and setup the RNS Manager
```
git clone git@github.com:rnsdomains/rns-manager-react.git

cd rns-manager-react
```

Install the dependencies

```
npm i
```

Copy the configuration file generated in step [1.2](#1.2.Deploying-smart-contracts) from `rif-marketplace-dev/out/rnsAdmin-ganache-config.json` into `rns-manager-react/src/config/contracts.local.json`.

In the `.env.local`  change the `REACT_APP_ENVIRONMENT_ID` to the network ID of our local ganache. You can find it using this command: 
```
curl --location --request POST 'localhost:8545/' \
     --header 'Content-Type: application/json' \
     --data-raw '{
         "jsonrpc":"2.0",
         "method":"net_version",
         "params":[],
         "id":67
     }'
```

Now you can start the UI (You may need to switch to another port such as http://localhost:3001 if you are already running the RIF Marketplace UI)

```
npm start
```

# Using the RIF Marketplace

## Registering domains using RNS
Go through the normal RNS registration flow but each time you make transaction you need to create new block as it requires at least 1 confirmation. You can do that with:
```
curl -H "Content-Type: application/json" -X POST --data \
        '{"id":1337,"jsonrpc":"2.0","method":"evm_increaseTime","params":[60]}' \
        http://localhost:8545

curl -H "Content-Type: application/json" -X POST --data \
        '{"id":1337,"jsonrpc":"2.0","method":"evm_mine"}' \
        http://localhost:8545
```
You can see more details in [this awesome tutorial](https://docs.google.com/document/d/1gxL-phr_8ihI_Hk6GJ9NotybY5WxifvC38SnV7hjeAI/edit?usp=sharing) by Leandro - section **rns-manager-react**
## Selling domain
## Buying domain

# Troubleshooting
### RNS manager missmatch between networks
Solution: switch back and forth a network on MetaMask/Nifty. If that does not work make sure you have setup correctly the network id in the RNS step.

## Contribute

There are some ways you can make this module better:

- Consult our [open issues](https://github.com/rsksmart/rif-marketplace-ui/issues) and take on one of them
- Help our tests reach 100% coverage!

## License

[MIT](./LICENSE)
