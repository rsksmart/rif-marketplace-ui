import Big from 'big.js'
import { MessageCodesEnum } from 'api/rif-marketplace-cache/notifications/interfaces'
import { initialState } from '../Context'
import { Notifications, State } from '../interfaces'
import actions from '../actions'

describe('Notifications Context Actions', () => {
  describe('SET_NOTIFICATIONS', () => {
    test('should return NotificationsContext state with new notifications', () => {
      const payload: Notifications = [
        {
          account: 'MOCK_ACCOUNT',
          payload: {
            agreementReference: 'MOCK_REFERENCE',
            code: MessageCodesEnum.E_AGREEMENT_SIZE_LIMIT_EXCEEDED,
            expectedSize: Big(1),
            hash: 'MOCK_HASH',
            size: Big(1),
            timestamp: 23423,
          },
          type: 'MOCK_TYPE',
        },
      ]
      const {
        notifications,
      }: Partial<State> = actions.SET_NOTIFICATIONS(
        initialState, payload,
      )

      expect(notifications).toBeTruthy()
      expect(notifications).toEqual(payload)
    })
  })
})
