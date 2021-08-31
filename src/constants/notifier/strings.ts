import { SupportedEventType, SupportedEventChannel } from 'config/notifier'

export const notifierChannelPlaceHolder: Record<SupportedEventChannel, string> = {
  API: 'Enter api destination',
  EMAIL: 'Enter email destination',
}

export const notifierEventTypeLabels: Record<SupportedEventType, string> = {
  SMARTCONTRACT: 'Smart Contract',
  NEWBLOCK: 'New Block',
}

export const NO_AVAILABLE_SUBSCRIPTION_PLAN = 'At least one active subscription plan must be available for registration.'

export const URL_ALREADY_REGISTERED = 'The domain is already registered.'

export const HTTPS_REQUIRED = 'The url must use https protocol.'

export const WRONG_URL = 'Wrong url.'

export const IP_NOT_ALLOWED = 'IP addresses are not allowed.'
export const TERMS_CONDITIONS_BUY = 'RIF and RIF Marketplace expressly disclaim responsibility and shall have no liability for any error, damage or loss, arising out or in connection with the use of any subscription plan offered by a Notifier or any information contained in it or offered by a Notifier, or from any action or decision taken as a result of using or buying any subscription plan or information provided by a Notifier. Such information is not investigated, monitored or checked for accuracy, adequacy, validity, usefulness or completeness by RIF and RIF Marketplace. RIF and RIF Marketplace make no warranty of any kind whatsoever, express or implied for the information provided by a Notifier. Your access and use of any subscription plan offered by a Notifier are at your own risk.'
