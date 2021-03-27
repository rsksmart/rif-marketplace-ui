import { Item } from 'models/Market'
import { NotifierEvent } from './NotifierItem'

export type NotifierEventItem = Item & {
  type: string
  channels: string
  signature: string
  event: NotifierEvent
}
