import uiConfig from 'ui-config.json'

const network: string = process.env.REACT_APP_NETWORK || 'ganache'

export default uiConfig[network]
