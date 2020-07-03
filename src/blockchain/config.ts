import networkConfig from 'ui-config.json'

const networkName = process.env.REACT_APP_NETWORK || 'ganache'
const network = networkConfig[networkName]

export default network
