import { getCurrentSummoner } from '../services/summoner'
import { getToken, removeToken, setToken } from './storage'

export async function isValidToken(token: string | null = null) {
  let isValid: AutenticatePromise;

  try {
    const currentSummoner = await getCurrentSummoner()
    const storageToken = getToken()

    if (storageToken) {
      isValid = await window.authenticate.verify(storageToken, currentSummoner)
      if (isValid.code === 200) return isValid
      if (currentSummoner.code === 200) return removeToken()
      return
    }

    if (token && currentSummoner.code === 200) {
      isValid = await window.authenticate.verify(token, currentSummoner)

      if (isValid.code !== 200) {
        return isValid
      }

      setToken(token)
      return isValid
    }
  } catch {
    return {
      code: 428,
      error: 'current_summoner_error',
      message: 'Provavelmente o LCU não está rodando ou você não está logado no League of Legends.',
    }
  }
}