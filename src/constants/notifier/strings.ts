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

export const TERMS_CONDITIONS_BUY = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut laoreet nisl, nec tempor dui. Proin purus eros, posuere pellentesque eros sodales, luctus cursus mauris. Sed elementum ultricies ligula, nec rutrum arcu porttitor eu. Maecenas malesuada porta arcu, ut ornare augue elementum eget. Vivamus eleifend elit nec cursus consectetur. Sed tincidunt malesuada diam nec pharetra. Praesent condimentum, diam interdum convallis accumsan, lacus erat consectetur ligula, a gravida erat leo ut risus. Vestibulum dapibus ipsum hendrerit semper ultrices. Donec id lacus eros. Aliquam varius hendrerit dui, vel congue eros commodo non. Etiam pretium, urna eu ornare consequat, nibh risus commodo nisl, ac vulputate libero dui pulvinar leo. Sed non ipsum varius, molestie libero eu, euismod felis. Etiam efficitur augue ut ligula dapibus sodales. Duis blandit consequat nisi pharetra interdum. Donec eget pretium elit.'

export default {}
