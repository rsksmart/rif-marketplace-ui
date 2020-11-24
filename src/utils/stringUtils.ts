export const getURLParamByName = (
  url: string, param: string,
): string | undefined => {
  const rgx = `^(?:\\?*${param}=)(\\w*)`
  const match = url.match(rgx)
  return match?.find((_, i) => i === 1)
}

export const isEmpty = (
  text: string | unknown,
): boolean => !(text && String(text).trim())
