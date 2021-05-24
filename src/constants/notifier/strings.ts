import { SupportedEventType, SupportedEventChannel } from 'config/notifier'

export const notifierChannelPlaceHolder: Record<SupportedEventChannel, string> = {
  API: 'Enter api destination',
}

export const notifierEventTypeLabels: Record<SupportedEventType, string> = {
  SMARTCONTRACT: 'Smart Contract',
  NEWBLOCK: 'New Block',
}

export default {}
