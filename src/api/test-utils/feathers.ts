const mockFeathersService = (mockReturnValue) => ({
    find: jest.fn(() => {
        return Promise.resolve(mockReturnValue)
    })
} as any)

export default mockFeathersService

