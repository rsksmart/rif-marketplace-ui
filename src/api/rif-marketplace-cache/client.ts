import createClient from 'api/client'

const CACHE_ADDRESS = process.env.REACT_APP_CACHE_ADDR || 'http://localhost:3030'

export default createClient(CACHE_ADDRESS)
