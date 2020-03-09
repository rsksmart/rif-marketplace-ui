import React, { Dispatch } from 'react';

import User from 'models/User';
import Middleware from 'store/storeUtils/middleware';
import { UserAction } from './userActions';
import userReducer from './userReducer';

export interface IUserState {
  user: User | undefined;
  isConnected?: boolean;
  sentMsgs: number;
}

interface IUserStoreProps {
  state: IUserState;
  dispatch: Dispatch<UserAction>;
}

export const initialState: IUserState = {
  user: undefined,
  sentMsgs: 0,
};

const UserStore = React.createContext({} as IUserStoreProps | any);

export const UserStoreProvider = ({ children }) => {
  const { useMiddleware } = Middleware.getInstance();

  const [state, dispatch] = useMiddleware(
    'UserState',
    userReducer,
    initialState,
  );

  const value = { state, dispatch };
  return <UserStore.Provider value={value}>{children}</UserStore.Provider>;
};

export default UserStore;
