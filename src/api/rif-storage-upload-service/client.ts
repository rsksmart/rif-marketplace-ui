import { createRestClient } from 'api/client'
import { UploadAPIService } from './upload'

export const UPLOAD_ADDRESS = process.env.REACT_APP_UPLOAD_ADDR || 'http://localhost:3031'

export default createRestClient<UploadAPIService>(UPLOAD_ADDRESS)
