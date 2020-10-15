export const isObject = (item: object | unknown): boolean => typeof item === 'object'
export const isUndefined = (item: undefined | unknown): boolean => typeof item === 'undefined'

export const recDiff = (obj1: object, obj2: object): unknown[] => {
  const keys = Object.keys(obj1)
  return keys.filter((key) => {
    const value1 = obj1[key]
    const value2 = obj2[key]

    if (isUndefined(value1) || isUndefined(value2)) return false

    if (isObject(value1) && isObject(value2)) {
      return recDiff(value1, value2).length
    }
    return value1 !== value2
  })
}
