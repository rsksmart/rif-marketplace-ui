import { Service } from '@feathersjs/feathers'

const mockFeathersService = (mockReturnValue): Service<any> => ({
  find: jest.fn(async () => await Promise.resolve(mockReturnValue)),
} as unknown as Service<any>)

export default mockFeathersService
