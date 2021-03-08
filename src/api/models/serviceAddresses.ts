import { RnsServiceAddress as RnsAddress } from 'api/rif-marketplace-cache/rns/common'
import { ConfirmationAddress } from 'api/rif-marketplace-cache/blockchain/confirmations'
import { XRServiceAddress } from 'api/rif-marketplace-cache/rates/xr'
import { StorageServiceAddress as StorageAddress } from 'api/rif-marketplace-cache/storage/interfaces'
import { NotificationsAddress } from 'api/rif-marketplace-cache/notifications/interfaces'
import { ServiceAddress as StorageUploadAddress } from 'api/rif-storage-upload-service/upload/interfaces'
import { NotifierServiceAddress } from 'api/rif-marketplace-cache/notifier'

export type ServiceAddress = XRServiceAddress
| ConfirmationAddress
| RnsAddress
| StorageAddress
| NotificationsAddress
| StorageUploadAddress
| NotifierServiceAddress
