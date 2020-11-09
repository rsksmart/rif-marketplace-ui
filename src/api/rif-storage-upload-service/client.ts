import createClient from 'api/client'

const UPLOAD_ADDRESS = process.env.REACT_APP_UPLOAD_ADDR || 'http://localhost:3031'

export default createClient(UPLOAD_ADDRESS, {
  autoConnect: false, // FIXME: REMOVE!!!
  forceNew: true,
})
