import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import { MarketFilter } from 'models/Market'
import io from 'socket.io-client'

const CACHE_BASE_ADDR = process.env.REACT_APP_CACHE_ADDR || 'http://localhost:3030'

const socket = io(CACHE_BASE_ADDR)
export const client = feathers()
client.configure(socketio(socket))
// <- extract

const service = {
  current: null,
}
export const createService = (path: string) => {
  service.current = client.service(path)
  return path
}

export const fetchMarketData = (filters?: MarketFilter) => {
  if (!service.current) throw Error('Not connected to a service')
  return (service.current as any).find({
    query: filters,
  })
}
