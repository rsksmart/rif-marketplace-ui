import { Big } from 'big.js'
import { APIService } from 'api/models/apiService'
import { Modify } from 'utils/typeUtils'

export type UploadResponse = {
    fileHash: string
    fileSize: number
    message: string
}

export type FileSizeResponse = {
    fileHash: string
    fileSizeBytes: number
}

export const serviceAddress = 'upload' as const
export type ServiceAddress = typeof serviceAddress

export type StorageUploadArgs = {
  files: File[]
  account: string
  peerId: string
  offerId: string
  contractAddress: string
}

export type UploadAPIService = Modify<APIService, {
  path: ServiceAddress
  post: (args: StorageUploadArgs) => Promise<UploadResponse>
  fetch: (fileHash: string) => Promise<Big>
}>
