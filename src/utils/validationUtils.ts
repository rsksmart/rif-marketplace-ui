const validateURL = (url: string, validProtocols: Array<string>): boolean => {
  try {
    const { protocol } = new URL(url)
    return validProtocols.includes(protocol)
  } catch {
    return false
  }
}

export default validateURL
