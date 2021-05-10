export const validateURL = (_url: string): boolean => {
  let url
  try {
    url = new URL(_url)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

export const validateEmail = (emails: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  let valid = true
  emails.split(';').forEach((email) => {
    if (re.test(String(email).toLowerCase()) === false) valid = false
  })
  return valid
}
