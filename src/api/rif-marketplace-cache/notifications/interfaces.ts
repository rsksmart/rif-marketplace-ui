import { APIService } from 'api/models/apiService'
import { Modify } from 'utils/typeUtils'
import { serviceAddress, serviceChannel } from '.'

export type NotoficationsAddress = typeof serviceAddress
export type NotificationsChannel = typeof serviceChannel

export type NotificationsAPI = Modify<APIService, {
  path: NotoficationsAddress
}>

export interface NotificationsItem {
  type: string
  account: string
  payload: NotificationPayload
}
interface BasePayload {
  agreementReference: string
}

export interface RetryPayload extends BasePayload {
  error: string
  retryNumber: number
  totalRetries: number
}

export interface HashInfoPayload extends BasePayload {
  hash: string
}

export type AgreementInfoPayload = BasePayload

export interface AgreementSizeExceededPayload extends BasePayload {
  hash: string
  size: number
  expectedSize: number
}

export type NotificationPayload = AgreementSizeExceededPayload
| AgreementInfoPayload
| HashInfoPayload
| RetryPayload

export type Confirmations = Record<string, NotificationsItem>

export type Transport = Modify<NotificationsItem, {
  payload: string
}>
