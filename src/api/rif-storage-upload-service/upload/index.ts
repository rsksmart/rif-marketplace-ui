import { AbstractAPIService, APIService } from 'api/models/apiService'
import { UIError } from 'models/UIMessage'
import { Modify } from 'utils/typeUtils'
import client, { UPLOAD_ADDRESS } from '../client'

export const serviceAddress = 'upload' as const
export type ServiceAddress = typeof serviceAddress

export type StorageUploadArgs = {
  files: File[]
  account: string
  peerId: string
  offerId: string
}

export type UploadAPIService = Modify<APIService, {
  path: ServiceAddress
  post: (args: StorageUploadArgs) => Promise<unknown>
}>

export default class UploadService
  extends AbstractAPIService
  implements UploadAPIService {
    path = serviceAddress

    constructor() {
      super(client)
    }

    _fetch = (): Promise<void> => Promise.resolve()

    post = async ({
      files, account, offerId, peerId,
    }: StorageUploadArgs): Promise<string> => {
      // TODO: the use of the propper client is commented out for now for bug: https://github.com/feathersjs/feathers/issues/1744#issuecomment-568015824
      // const data = await this.service.create(formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // })

      const formData = new FormData()

      files.forEach((file) => {
        formData.append('files', file, file.name)
      })

      formData.append('offerId', offerId)
      formData.append('peerId', peerId)
      formData.append('account', account)

      const options = {
        method: 'POST',
        host: UPLOAD_ADDRESS,
        path: `/${serviceAddress}`,
        body: formData,
      }

      const response = await fetch(`${UPLOAD_ADDRESS}/upload`, options)

      if (response.status !== 200) {
        throw new UIError({
          error: new Error(await response.json()),
          text: 'Error: Could not upload files:',
          id: 'service-post',
        })
      }
      const data = await response.json()

      return data.fileHash
    }
}
