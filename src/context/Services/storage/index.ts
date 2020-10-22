import withContext, {
  Context,
  Provider,
  Props,
} from './OffersContext'

export {
  Context as StorageOffersContext,
  Provider as StorageOffersContextProvider,
}

export type StorageOffersContextProps = Props

const withStorageOffersContext = withContext

export default withStorageOffersContext
