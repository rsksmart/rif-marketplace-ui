const mockFeathersService = (mockReturnValue) => ({
  find: jest.fn(() => Promise.resolve(mockReturnValue)),
} as any)

export default mockFeathersService
