// import { Contact, User } from 'models'
import { IAction } from 'store/storeUtils/interfaces'
import LocalStorage from 'utils/LocalStorage'
import { IUserState } from './UserStore'
import User from 'models/User'

export enum USER_ACTIONS {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

const persistence = LocalStorage.getInstance()


export type UserPayload = INodePayload

export interface UserAction extends IAction<UserPayload> {
  type: USER_ACTIONS
}

export interface INodePayload {
  user: User
}