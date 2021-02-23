import createClient from 'api/client'
import { RnsAPIService } from './rns/common'

const CACHE_ADDRESS = process.env.REACT_APP_CACHE_ADDR ?? 'http://localhost:3030'

export default createClient<RnsAPIService>(CACHE_ADDRESS, {
  transports: ['websocket'],
  forceNew: true,
})
