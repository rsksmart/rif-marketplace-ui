import { IAction } from 'store/storeUtils/interfaces'
import User from 'models/User'

export enum USER_ACTIONS {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export type UserPayload = INodePayload

export interface UserAction extends IAction<UserPayload> {
  type: USER_ACTIONS
}

export interface INodePayload {
  user: User
}