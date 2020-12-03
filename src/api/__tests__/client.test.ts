import createClient, { createRestClient } from 'api/client'
import feathers from '@feathersjs/feathers'

describe('api/client', () => {
  describe('createClient', () => {
    let client: feathers.Application<unknown>
    beforeAll(() => {
      client = createClient('fake_addr')
    })
    test('should return an instance of feathers application', () => {
      expect(client).toBeTruthy()
    })
    test('should contain io property', () => {
      expect(client.io).toBeTruthy()
    })
  })

  describe('createRestClient', () => {
    let client: feathers.Application<unknown>
    beforeAll(() => {
      client = createRestClient('fake_addr')
    })

    test('should return an instance of feathers application', () => {
      expect(client).toBeTruthy()
    })
    test('should contain rest property', () => {
      expect(client.rest).toBeTruthy()
    })
  })
})
