import { createRestClient } from 'api/client'
import { NotifierAPIService } from './interfaces'

export const NOTIFIER_ADDRESS = process.env.REACT_APP_NOTIFIER_ADDR || 'http://localhost:3333'

export default createRestClient<NotifierAPIService>(NOTIFIER_ADDRESS)
