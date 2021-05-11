const validateURL = (_url: string): boolean => {
  let url
  try {
    url = new URL(_url)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

export default validateURL
