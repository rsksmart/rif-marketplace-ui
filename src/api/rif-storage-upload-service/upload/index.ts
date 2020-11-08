import { AbstractAPIService, APIService } from 'api/models/apiService'
import { Modify } from 'utils/typeUtils'
import client from './client'

export const xrServiceAddress = 'upload' as const
export type XRServiceAddress = typeof xrServiceAddress

export type UploadAPIService = Modify<APIService, {
  path: XRServiceAddress
  post: (data) => Promise<void>
}>

export default class UploadService
  extends AbstractAPIService
  implements UploadAPIService {
    path = xrServiceAddress

    constructor() {
      super(client)
    }

    _fetch = (): Promise<void> => Promise.resolve()

    post = async (): Promise<void> => {

    }
}
