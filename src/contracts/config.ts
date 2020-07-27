import uiConfig from 'ui-config.json'

const network: string = process.env.REACT_APP_NETWORK || 'ganache'
const { contractAddresses } = uiConfig[network]

export const marketPlaceAddress = contractAddresses.marketplace.toLowerCase()
export const rifTokenAddress = contractAddresses.rif.toLowerCase()
export const rnsAddress = contractAddresses.rnsDotRskOwner.toLowerCase()
