import StakesService, {
  address, Address,
  wsChannel, WSChannel,
} from './api'

export {
  address as notifierStakesAddress,
  wsChannel as notifierStakesWSChannel,
}

export default StakesService

export type NotifierStakesAddress = Address
export type NotifierStakesWSChannel = WSChannel
