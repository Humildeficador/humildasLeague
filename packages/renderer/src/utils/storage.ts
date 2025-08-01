const LOCALSTORAGE_KEY = import.meta.env.VITE_LOCALSTORAGE_KEY

export function getToken() {
  return localStorage.getItem(LOCALSTORAGE_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(LOCALSTORAGE_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(LOCALSTORAGE_KEY)
}