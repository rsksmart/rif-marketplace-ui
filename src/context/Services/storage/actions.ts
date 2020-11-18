import {
  Actions, State, IsWhitelistedProviderPayload,
} from './interfaces'

const actions: Actions = {
  SET_IS_WHITELISTED_PROVIDER: (
    state: State,
    { isWhitelistedProvider }: IsWhitelistedProviderPayload,
  ): State => ({
    ...state,
    isWhitelistedProvider,
  }),
}

export default actions
