import { AbstractAPIService } from 'api/models/apiService'
import { UIError } from 'models/UIMessage'
import client, { UPLOAD_ADDRESS } from '../client'
import {
  serviceAddress, StorageUploadArgs, UploadAPIService, UploadResponse,
} from './interfaces'

export default class UploadService
  extends AbstractAPIService
  implements UploadAPIService {
    path = serviceAddress

    constructor() {
      super(client)
    }

    _fetch = (): Promise<void> => Promise.resolve()

    post = async ({
      files, account, offerId, peerId, contractAddress,
    }: StorageUploadArgs): Promise<UploadResponse> => {
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
      formData.append('contractAddress', contractAddress)

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
      const data: UploadResponse = await response.json()

      return data
    }
}
