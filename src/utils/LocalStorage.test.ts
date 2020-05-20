import LocalStorage from 'utils/LocalStorage'

const persistence = LocalStorage.getInstance()
// const globalAny: any = global;

// const localStorageMock = {
//   getItem: jest.fn(),
//   setItem: jest.fn(),
//   removeItem: jest.fn(),
//   clear: jest.fn(),
// };
/* eslint-disable no-proto */
jest.spyOn(window.localStorage.__proto__, 'getItem')
jest.spyOn(window.localStorage.__proto__, 'setItem')
jest.spyOn(window.localStorage.__proto__, 'clear')
/* eslint-enable no-proto */

// globalAny.localStorage = localStorageMock;


describe('utils/LocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('adds object item to local storage', () => {
    const key = 'item'
    const item = { param: 'value' }
    const expectedItem = JSON.stringify(item)

    persistence.setItem(key, item)
    expect(localStorage.setItem).toBeCalledWith(key, expectedItem)
  })

  test('adds string item to local storage', () => {
    const key = 'item'
    const item = 'value'
    const expectedItem = item

    persistence.setItem(key, item)
    expect(localStorage.setItem).toBeCalledWith(key, expectedItem)
  })

  test('gets object item from local storage', () => {
    const key = 'item'
    const item = { param: 'value' }
    persistence.setItem(key, item)

    persistence.getItem(key)
    expect(localStorage.getItem).toBeCalledWith(key)
  })

  test('calls localStorage clear method', () => {
    persistence.clear()
    expect(localStorage.clear).toBeCalled()
  })
})
