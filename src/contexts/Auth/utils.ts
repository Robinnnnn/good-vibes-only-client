export const cookiesToObj = (): { [key: string]: string } => {
  const cookies = document.cookie
  return cookies.split(';').reduce((obj, s) => {
    const [key, val] = s.trim().split('=')
    return { ...obj, [key]: val }
  }, {})
}

// TODO: make a server request as well?
export const clearCookies = (): void => {
  deleteCookie('access_token')
  deleteCookie('refresh_token')
}

function deleteCookie(key: string): void {
  document.cookie = `${encodeURIComponent(
    key
  )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
