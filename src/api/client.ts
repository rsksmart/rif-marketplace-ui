import feathers from '@feathersjs/feathers'
import feathersSocketioClient from '@feathersjs/socketio-client'
import io from 'socket.io-client'
import auth from '@feathersjs/authentication-client'

import rest from '@feathersjs/rest-client'

const createClient = <ServiceType extends object>(
  addr: string,
  options?: SocketIOClient.ConnectOpts,
): feathers.Application<ServiceType> => {
  const socketioInit = io(
    addr,
    options,
  )
  const client = feathers<ServiceType>()
  client.configure(feathersSocketioClient(socketioInit))
  client.configure(auth({}))

  return client
}

export default createClient

export const createRestClient = <ServiceType extends object>(
  addr: string,
): feathers.Application<ServiceType> => {
  const client = feathers<ServiceType>()
  const restClient = rest(addr)
  client.configure(restClient.fetch(window.fetch))
  return client
}
