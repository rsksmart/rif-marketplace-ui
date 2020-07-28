import networkConfig from 'config'

const {
  contractAddresses: { marketplace, rif, rnsDotRskOwner },
} = networkConfig

export const marketPlaceAddress = marketplace.toLowerCase()
export const rifTokenAddress = rif.toLowerCase()
export const rnsAddress = rnsDotRskOwner.toLowerCase()
