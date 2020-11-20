import { APIService } from 'api/models/apiService'
import { Modify } from 'utils/typeUtils'
import { Big } from 'big.js'
import { serviceAddress, serviceChannel } from '.'

export type NotificationsAddress = typeof serviceAddress
export type NotificationsChannel = typeof serviceChannel

export type NotificationsAPI = Modify<APIService, {
  path: NotificationsAddress
}>

export enum MessageCodesEnum {
  I_AGREEMENT_NEW = 'I_AGR_NEW', // PROVIDER
  I_AGREEMENT_EXPIRED = 'I_AGR_EXP', // BOTH
  I_HASH_PINNED = 'I_HASH_STOP', // CONSUMER
  E_AGREEMENT_SIZE_LIMIT_EXCEEDED = 'E_AGR_SIZE_OVERFLOW', // CONSUMER
}

export type Transport = {
  type: string
  account: string
  payload: Modify<NotificationPayload, {
    timestamp: string
    size: string
    expectedSize: string
  }>
}

export interface NotificationItem {
  type: string
  account: string
  payload: NotificationPayload
}
interface BasePayload {
  agreementReference: string
}

export interface HashInfoPayload extends BasePayload {
  hash: string
}

export type AgreementInfoPayload = BasePayload

export interface AgreementSizeExceededPayload extends BasePayload {
  hash: string
  size: Big
  expectedSize: Big
}

export type NotificationPayload = {
  code: MessageCodesEnum
  timestamp: number
} & (
  | AgreementSizeExceededPayload
  | AgreementInfoPayload
  | HashInfoPayload
)
