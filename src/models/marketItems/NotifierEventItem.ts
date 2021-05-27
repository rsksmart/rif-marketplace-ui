import { Item } from 'models/Market'

export const notifierEventItemHeaders = {
  name: 'Name',
  type: 'Type',
  channels: 'Channels',
  actions: '',
} as const

export type NotifierEventItem = Item & {
  [K in keyof Omit<typeof notifierEventItemHeaders, | 'name' | 'actions'>]: string
} & {
  signature: string
}
