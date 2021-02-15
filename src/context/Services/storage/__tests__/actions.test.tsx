import {
  initialState,
  actions,
  StorageGlobalContextState,
} from '..'

describe('Storage Context Actions', () => {
  const {
    SET_IS_WHITELISTED_PROVIDER,
  } = actions

  describe('SET_IS_WHITELISTED_PROVIDER', () => {
    test('should return StorageContext state with correct isWhitelistedProvider property', () => {
      const {
        isWhitelistedProvider,
      }: Partial<StorageGlobalContextState> = SET_IS_WHITELISTED_PROVIDER(
        initialState, {
          isWhitelistedProvider: true,
        },
      )

      expect(isWhitelistedProvider).toBeTruthy()
    })
  })
})
