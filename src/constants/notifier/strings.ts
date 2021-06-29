import { SupportedEventType, SupportedEventChannel } from 'config/notifier'

export const notifierChannelPlaceHolder: Record<SupportedEventChannel, string> = {
  API: 'Enter api destination',
}

export const notifierEventTypeLabels: Record<SupportedEventType, string> = {
  SMARTCONTRACT: 'Smart Contract',
  NEWBLOCK: 'New Block',
}

export const NO_AVAILABLE_SUBSCRIPTION_PLAN = 'At least one subscription plan must be available for registration'

export const URL_ALREADY_REGISTERED = 'The URL is already registered'

export default {}
