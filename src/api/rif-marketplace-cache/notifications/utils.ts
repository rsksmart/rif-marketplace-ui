import { MapFromTransport } from 'api/models/apiService'
import { NotificationPayload, NotificationsItem, Transport } from './interfaces'

const mapFromTransport: MapFromTransport<
Transport,
NotificationsItem
> = (item) => ({
  ...item,
  payload: item.payload as unknown as NotificationPayload,
})

const utils = {
  mapFromTransport,
}

export default utils
