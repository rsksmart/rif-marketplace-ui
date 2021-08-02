import { SupportedEventType, SupportedEventChannel } from 'config/notifier'

export const notifierChannelPlaceHolder: Record<SupportedEventChannel, string> = {
  API: 'Enter api destination',
  EMAIL: 'Enter email address',
}

export const notifierEventTypeLabels: Record<SupportedEventType, string> = {
  SMARTCONTRACT: 'Smart Contract',
  NEWBLOCK: 'New Block',
}

export const NO_AVAILABLE_SUBSCRIPTION_PLAN = 'At least one active subscription plan must be available for registration.'

export const URL_ALREADY_REGISTERED = 'The url is already registered.'

export const HTTPS_REQUIRED = 'The url must use https protocol.'

export const WRONG_URL = 'Wrong url.'

export default {}
