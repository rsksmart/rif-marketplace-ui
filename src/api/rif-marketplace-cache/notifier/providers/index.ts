import ProvidersService, {
  address, Address,
  wsChannel, WSChannel,
} from './api'

export {
  address as notifierProvidersAddress,
  wsChannel as notifierProvidersChannel,
}

export default ProvidersService

export type NotifierProvidersAddress = Address
export type NotifierProvidersWSChannel = WSChannel
