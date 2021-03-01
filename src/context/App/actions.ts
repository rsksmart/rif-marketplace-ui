import {
  Actions, ErrorMessagePayload,
  LoadingPayload, MessagePayload,
  RemoveMessagePayload, SetAlertPayload,
} from './interfaces'

const actions: Actions = {
  SET_IS_LOADING: (state, payload: LoadingPayload) => {
    const { isLoading, message, id } = payload
    const { messages, loaders } = state
    const messagesCopy = { ...messages }

    if (!isLoading) {
      delete messagesCopy.loading
    }
    return {
      ...state,
      messages: message
        ? {
            ...messagesCopy,
            loading: {
              text: message,
              type: 'info',
            },
          }
        : messagesCopy,
      loaders: {
        ...loaders,
        [id]: isLoading,
      },
    }
  },
  SET_MESSAGE: (state, payload: MessagePayload | ErrorMessagePayload) => {
    const { messages } = state
    const { id, ...message } = payload

    return {
      ...state,
      messages: {
        ...messages,
        [id]: message,
      },
    }
  },
  REMOVE_MESSAGE: (state, payload: RemoveMessagePayload) => {
    const { id } = payload
    const { messages } = state

    const messagesCopy = { ...messages }
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete messagesCopy[id]

    return {
      ...state,
      messages: messagesCopy,
    }
  },
  SET_ALERT: (state, { message }: SetAlertPayload) => ({
    ...state,
    alertPanel: {
      display: true,
      message,
    },
  }),
  HIDE_ALERT: (state) => ({
    ...state,
    alertPanel: {
      display: false,
      message: '',
    },
  }),
}

export default actions
