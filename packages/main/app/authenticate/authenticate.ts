import jwt, { JwtPayload } from 'jsonwebtoken'
import { CurrentSummoner } from '../types/matchmaking'

interface JwtUserPayload extends JwtPayload {
  name: string,
  accounts: string[],
  iat: number,
  exp: number
}


/* export function authenticate(token: string, currentSummoner: CurrentSummoner) {
  const { JWT_SECRET } = process.env
  const nick = `${currentSummoner.gameName}#${currentSummoner.tagLine}`
  try {
    const firstDecode = jwt.decode(token) as JwtUserPayload
    if (!firstDecode.accounts.includes(nick)) throw new UnauthorizedSummoner(`406 ${firstDecode.name}`)
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtUserPayload
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) return false
    if (error instanceof UnauthorizedSummoner) return error.message
    return false
  }
}

class UnauthorizedSummoner extends Error { }
 */
export function authenticate(token: string, currentSummoner: CurrentSummoner) {
  const { JWT_SECRET } = process.env
  const nick = `${currentSummoner.gameName}#${currentSummoner.tagLine}`
  try {
    const firstDecode = jwt.decode(token) as JwtUserPayload
    if (!firstDecode.accounts.includes(nick)) {
      return {
        code: 401,
        error: 'unauthorized_summoner',
        message: `Pô essa key não ta permitida pra essa conta, fica esperto em ${firstDecode.name}`
      }
    }
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtUserPayload
    return { code: 200, ...decoded }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { code: 498, error: 'token_expired', message: 'Token expirado' }
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return { code: 498, error: 'token_invalid', message: 'Token inválido' }
    }
    return { code: 500, error: 'unknown', message: 'Erro desconhecido' }
  }
}