import feathers from '@feathersjs/feathers'
import feathersSocketioClient from '@feathersjs/socketio-client'
import io from 'socket.io-client'
import auth from '@feathersjs/authentication-client'

const defaultOptions: SocketIOClient.ConnectOpts = {
}

const createClient = <ServiceType extends object>(
  addr: string,
  options?: SocketIOClient.ConnectOpts,
): feathers.Application<ServiceType> => {
  const socketioInit = io(
    addr,
    {
      ...defaultOptions,
      ...options,
    },
  )
  const client = feathers<ServiceType>()
  client.configure(feathersSocketioClient(socketioInit))
  client.configure(auth({}))

  return client
}

export default createClient
