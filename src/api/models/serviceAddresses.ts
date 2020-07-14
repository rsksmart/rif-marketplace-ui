import { RnsAddresses as RnsAddress } from 'api/rif-marketplace-cache/rns/common'
import { ConfirmationAddress } from 'api/rif-marketplace-cache/blockchain/confirmations'
import { XRServiceAddress } from 'api/rif-marketplace-cache/rates/xr'

export type ServiceAddress = XRServiceAddress | ConfirmationAddress | RnsAddress // | 'storage/v0/offers'
