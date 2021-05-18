import { ContractABIEvent, ContractABIItem } from 'api/blockscout/interface'
import { UIError } from 'models/UIMessage'

const BLOCKSCOUT_API_ADDRESS = 'https://blockscout.com/rsk/mainnet/api?module=contract&action=getabi&address='

const getABIEvents = async (contract: string): Promise<ContractABIEvent[]> => {
  const response = await fetch(`${BLOCKSCOUT_API_ADDRESS}${contract}`)

  if (response.status !== 200) {
    throw new UIError({
      error: new Error(await response.json()),
      text: 'could not get abi',
      id: 'service-fetch',
    })
  }
  const { message, result } = await response.json()

  if (message !== 'OK') {
    throw new UIError({
      error: new Error(message),
      text: `Invalid contract address: ${contract}`,
      id: 'service-fetch',
    })
  }
  const abiItems: ContractABIItem[] = JSON.parse(result)
  return abiItems.filter((abiItem: ContractABIItem) => abiItem.type === 'event').map((item) => item as ContractABIEvent)
}

export default getABIEvents
