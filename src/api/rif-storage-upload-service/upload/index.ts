import { AbstractAPIService, APIService } from 'api/models/apiService'
import { Modify } from 'utils/typeUtils'
import client from '../client'

export const serviceAddress = 'upload' as const
export type ServiceAddress = typeof serviceAddress

export type UploadAPIService = Modify<APIService, {
  path: ServiceAddress
  post: (files: File[]) => Promise<unknown>
}>

export default class UploadService
  extends AbstractAPIService
  implements UploadAPIService {
    path = serviceAddress

    constructor() {
      super(client)
    }

    _fetch = (): Promise<void> => Promise.resolve()

    post = async (): Promise<unknown> => {
      // FIXME: change for a real request
      const result: {
        message: string
        fileHash: string
      } = await new Promise((resolve) => {
        const wait = setTimeout(() => {
          clearTimeout(wait)
          resolve({
            message: 'File uploaded',
            fileHash: '0xFILE_HASH',
          })
        }, 10000)
      })

      return result.fileHash
    }
}
