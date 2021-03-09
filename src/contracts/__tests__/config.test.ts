import { rifTokenAddress } from 'contracts/config'

describe('Contracts config', () => {
  describe('rifTokenAddress', () => {
    test('should be a lower case string', () => {
      expect(rifTokenAddress).toBeTruthy()
      expect(typeof rifTokenAddress).toBe('string')
      expect(rifTokenAddress).toEqual(rifTokenAddress.toLowerCase())
    })
  })
})
