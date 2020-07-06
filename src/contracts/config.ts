import contractAdds from 'ui-config.json'

const network: string = process.env.REACT_APP_NETWORK || 'ganache'

export const marketPlaceAddress = contractAdds[network].marketplace.toLowerCase()
export const rifTokenAddress = contractAdds[network].rif.toLowerCase()
export const rnsAddress = contractAdds[network].rnsDotRskOwner.toLowerCase()
