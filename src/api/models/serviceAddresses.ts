import { RnsAddresses as RnsAddress } from 'api/rif-marketplace-cache/rns/common'
import { ConfirmationAddress } from 'api/rif-marketplace-cache/confirmationsController'
import { XEServiceAddress } from 'api/rif-marketplace-cache/rates/exchangeRateController'

export type ServiceAddress = XEServiceAddress | ConfirmationAddress | RnsAddress // | 'storage/v0/offers'
