import uiConfig from 'ui-config.json'

const network: string = process.env.REACT_APP_NETWORK || 'ganache'
export const networkId: number = Number(
  process.env.REACT_APP_REQUIRED_NETWORK_ID,
) || 8545

export const networkName = process.env.REACT_APP_REQUIRED_NETWORK_NAME
    || 'Localhost 8545'

export default uiConfig[network]

export const appVersion = process.env.REACT_APP_VERSION

export const TRACKING_URL = process.env.REACT_APP_TRACKING_URL || ''
export const TRACKING_DATA_DOMAIN = process.env.REACT_APP_TRACKING_DATADOMAIN || ''
