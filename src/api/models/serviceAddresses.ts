import { RnsServiceAddress as RnsAddress } from 'api/rif-marketplace-cache/rns/common'
import { ConfirmationAddress } from 'api/rif-marketplace-cache/blockchain/confirmations'
import { XRServiceAddress } from 'api/rif-marketplace-cache/rates/xr'
import { StorageServiceAddress as StorageAddress } from 'api/rif-marketplace-cache/storage/interfaces'

export type ServiceAddress = XRServiceAddress | ConfirmationAddress | RnsAddress | StorageAddress
