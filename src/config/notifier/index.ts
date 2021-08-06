export type SupportedEventChannel = | 'API' | 'EMAIL'

export const SUPPORTED_EVENTS = {
  SMARTCONTRACT: 'SMARTCONTRACT',
  NEWBLOCK: 'NEWBLOCK',
} as const

export type SupportedEventType = keyof typeof SUPPORTED_EVENTS

export const SUPPORTED_EVENT_TYPES: Array<SupportedEventType> = Object.keys(SUPPORTED_EVENTS) as Array<SupportedEventType>

export const SUPPORTED_EVENT_CHANNELS: Array<SupportedEventChannel> = ['API', 'EMAIL']
export const SUPPORTED_API_CHANNEL_PROTOCOLS = ['http:', 'https:']

export const SUPPORTED_PROVIDER_PROTOCOLS = ['https:']

export const ALLOW_INSECURE_CONNECTIONS = Boolean(Number(
  process.env.REACT_APP_ALLOW_INSECURE_CONNECTIONS,
)) || false
