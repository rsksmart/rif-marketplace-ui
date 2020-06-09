import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import { MarketFilter } from 'models/Market'
import io from 'socket.io-client'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import { RnsServicePaths } from './domainsController'

const CACHE_BASE_ADDR = process.env.REACT_APP_CACHE_ADDR || 'http://localhost:3030'

const socket = io(CACHE_BASE_ADDR)
export const client = feathers()
client.configure(socketio(socket))

const service = {
  current: null,
}

export const createService = (path: RnsServicePaths, dispatch) => {
  const promptRefresh = (updatedTokenId) => {
    dispatch({ type: MARKET_ACTIONS.SET_META, payload: { updatedTokenId } })
  }
  const svc = client.service(path)
  svc.on('updated', ({ tokenId }) => promptRefresh(tokenId))
  svc.on('patched', ({ tokenId }) => promptRefresh(tokenId))
  svc.on('created', ({ tokenId }) => promptRefresh(tokenId))
  svc.on('removed', ({ tokenId }) => promptRefresh(tokenId))
  service.current = svc
  return path
}

export const fetchMarketData = (filters?: MarketFilter) => {
  if (!service.current) throw Error('Not connected to a service')
  return (service.current as any).find({
    query: filters,
  })
}
