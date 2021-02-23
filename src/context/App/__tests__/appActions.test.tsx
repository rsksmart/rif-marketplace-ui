import {
  LoadingPayload,
  MessagePayload, RemoveMessagePayload,
  SetAlertPayload,
} from 'context/App/interfaces'
import { LoaderId } from 'models/UIMessage'
import { initialState, AppState, appActions } from '..'

const testActionReturn = (
  action: (state: AppState, payload: unknown) => AppState,
  payload: unknown,
): void => {
  test('should return AppContext state', () => {
    const {
      alertPanel,
      apis,
      contextID,
      loaders,
      messages,
    }: Partial<AppState> = action(initialState, payload)

    expect(alertPanel).toBeTruthy()
    expect(apis).toBeTruthy()
    expect(contextID).toBeTruthy()
    expect(loaders).toBeTruthy()
    expect(messages).toBeTruthy()
  })
}

describe('AppContext Actions', () => {
  const {
    SET_IS_LOADING,
    SET_MESSAGE,
    REMOVE_MESSAGE,
    SET_ALERT,
    HIDE_ALERT,
  } = appActions

  describe('SET_IS_LOADING', () => {
    testActionReturn(
      SET_IS_LOADING,
      {
        id: 'data',
        isLoading: true,
        message: 'Test message.',
      },
    )

    test('should set state.loader props named by payload.id to payload.isLoading', () => {
      const { loaders }: Partial<AppState> = SET_IS_LOADING(initialState, {
        id: 'data',
        isLoading: true,
        message: 'Test message.',
      })

      Object.keys(loaders).forEach((id) => {
        expect(initialState.loaders[id]).toBeFalsy()

        expect(SET_IS_LOADING(initialState, {
          id: id as LoaderId,
          isLoading: true,
          message: 'Test message.',
        }).loaders[id]).toEqual(true)

        expect(SET_IS_LOADING(initialState, {
          id: id as LoaderId,
          isLoading: false,
        }).loaders[id]).toEqual(false)
      })
    })

    test('should set state.messages.loading to { text: payload.message, type: \'info\' }', () => {
      const payload: LoadingPayload = {
        id: 'data',
        isLoading: true,
        message: 'Test message.',
      }
      expect(initialState.messages.loading).toBeFalsy()

      const {
        messages,
      }: Partial<AppState> = SET_IS_LOADING(initialState, payload)

      expect(messages.loading?.text).toEqual(payload.message)
      expect(messages.loading?.type).toEqual('info')
    })

    test('should remove state.messages.loading when given payload.isLoading', () => {
      const payload: LoadingPayload = {
        id: 'data',
        isLoading: false,
      }
      const {
        messages,
      }: Partial<AppState> = SET_IS_LOADING(initialState, payload)

      expect(messages.loading).not.toBeTruthy()
    })
  })

  describe('SET_MESSAGE', () => {
    testActionReturn(
      SET_MESSAGE,
      {
        id: 'web3-getGasPrice',
        text: 'nah',
        type: 'error',
      },
    )

    test('should set state.messages[payload.id] to the rest of the payload object.', () => {
      const payload: MessagePayload = {
        id: 'web3-getGasPrice',
        text: 'nah',
        type: 'error',
      }

      expect(initialState.messages[payload.id]).toBeFalsy()

      const {
        messages,
      }: Partial<AppState> = SET_MESSAGE(initialState, payload)

      expect(messages[payload.id]).toEqual({
        text: payload.text,
        type: payload.type,
      })
    })
  })

  describe('REMOVE_MESSAGE', () => {
    testActionReturn(
      REMOVE_MESSAGE,
      {
        id: 'web3-getGasPrice',
      },
    )

    test('should remove state.messages[payload.id].', () => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      initialState.messages['contract-marketplace-getPlacement'] = {} as MessagePayload
      const payload: RemoveMessagePayload = {
        id: 'contract-marketplace-getPlacement',
      }

      const {
        messages,
      }: Partial<AppState> = REMOVE_MESSAGE(initialState, payload)

      expect(messages['contract-marketplace-getPlacement']).toBeFalsy()
    })
  })

  describe('SET_ALERT', () => {
    const payload: SetAlertPayload = {
      message: 'Test alert',
    }

    testActionReturn(
      SET_ALERT,
      payload,
    )

    test('should set state.alertPanel.display true and state.alertPanel.message.', () => {
      expect(initialState.alertPanel.display).toBeFalsy()
      expect(initialState.alertPanel.message).toBeFalsy()

      const {
        alertPanel,
      }: Partial<AppState> = SET_ALERT(initialState, payload)
      expect(alertPanel).toEqual({
        display: true,
        message: payload.message,
      })
    })
  })

  describe('HIDE_ALERT', () => {
    testActionReturn(
      HIDE_ALERT,
      {},
    )

    test('should set state.alertPanel.display false and state.alertPanel.message "".', () => {
      initialState.alertPanel.display = true
      initialState.alertPanel.message = 'BS'
      const expectedObject = {
        display: false,
        message: '',
      }

      const {
        alertPanel,
      }: Partial<AppState> = HIDE_ALERT(initialState, {})
      expect(alertPanel).toEqual(expectedObject)
    })
  })
})
