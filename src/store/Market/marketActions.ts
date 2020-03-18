// import { Contact, User } from 'models';
import { IAction } from 'store/storeUtils/interfaces';
import LocalStorage from 'utils/LocalStorage';

export enum MARKET_ACTIONS {
  NOOP = 'NOOP'
}

const persistence = LocalStorage.getInstance()


export type MarketPayload = {}

export interface MarketAction extends IAction<MarketPayload> {
  type: MARKET_ACTIONS
}