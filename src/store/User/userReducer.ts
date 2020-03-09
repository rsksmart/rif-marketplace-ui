import LocalStorage from 'utils/LocalStorage';
import Logger from 'utils/Logger';
import {
  USER_ACTIONS,
  UserAction,
  UserPayload,
  INodePayload,
} from './userActions'
import { initialState, IUserState } from './UserStore'

const persistence = LocalStorage.getInstance()
const logger = Logger.getInstance()

const userReducer = (state = initialState, action: UserAction) => {
  const { type, payload } = action
  const userAction = userActions[type]
  if (!!userAction) logger.debug('userReducer -> action', action)
  const newState = (!!userAction && userAction(state, payload)) || state

  return newState
}
export default userReducer

type IUserActions = {
  [key in USER_ACTIONS]: (state: IUserState, payload: UserPayload) => IUserState
}

const {
  LOGOUT,
  LOGIN,
} = USER_ACTIONS

const userActions: IUserActions = {
  [LOGIN]: (state, payload: INodePayload) => {
    const { user } = payload
    if (user.rnsName) persistence.setItem('rnsName', user.rnsName)
    return {
      ...state,
      user,
    }
  },
  [LOGOUT]: (_state, _payload) => {
    persistence.clear()
    return initialState
  },
}

