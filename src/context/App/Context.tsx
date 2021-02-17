import { ConfirmationsService } from 'api/rif-marketplace-cache/blockchain/confirmations'
import { NotificationsService } from 'api/rif-marketplace-cache/notifications'
import { XRService } from 'api/rif-marketplace-cache/rates/xr'
import { DomainsService } from 'api/rif-marketplace-cache/rns/domains'
import { OffersService } from 'api/rif-marketplace-cache/rns/offers'
import { SoldDomainsService } from 'api/rif-marketplace-cache/rns/sold'
import { StorageAgreementService } from 'api/rif-marketplace-cache/storage/agreements'
import { AvailableCapacityService } from 'api/rif-marketplace-cache/storage/available-size'
import { AvgBillingPriceService } from 'api/rif-marketplace-cache/storage/avg-billing-plan-price'
import { StorageOffersService } from 'api/rif-marketplace-cache/storage/offers'
import { StakesService } from 'api/rif-marketplace-cache/storage/stakes'
import UploadService from 'api/rif-storage-upload-service/upload'
import createReducer from 'context/storeUtils/reducer'
import React, {
  createContext, FC, useReducer,
} from 'react'
import { appActions } from '.'
import { contextID, Props, State } from './interfaces'

export const initialState: State = {
  contextID,
  apis: {
    notification: new NotificationsService(),
    confirmations: new ConfirmationsService(),
    'rns/v0/offers': new OffersService(),
    'rns/v0/domains': new DomainsService(),
    'rns/v0/sold': new SoldDomainsService(),
    'rates/v0': new XRService(),
    'storage/v0/offers': new StorageOffersService(),
    'storage/v0/avgBillingPrice': new AvgBillingPriceService(),
    'storage/v0/agreements': new StorageAgreementService(),
    'storage/v0/stakes': new StakesService(),
    'storage/v0/availableCapacity': new AvailableCapacityService(),
    upload: new UploadService(),
  },
  messages: {},
  loaders: {
    contract: false,
    data: false,
    filters: false,
    other: false,
  },
  alertPanel: {
    display: false,
    message: '',
  },
}

export const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
})
export const AppContextProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    createReducer(initialState, appActions),
    initialState,
  )

  const value = { state, dispatch }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export default Context
