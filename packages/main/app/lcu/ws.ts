import { createWebSocketConnection, LeagueWebSocket } from 'league-connect'
import { useCredentials } from './credentials'

let WS: LeagueWebSocket | null = null

export async function initLWS() {
  console.log('Iniciando LWS.')
  WS = await createWebSocketConnection({
    authenticationOptions: {
      awaitConnection: true
    }
  })
  if (!WS) throw new Error('Não foi possível iniciar o LWS.')

  console.log('LWS Iniciado.')
  await useCredentials()
}

export function getLWSInstance() {
  if (!WS) throw new Error('LWS ainda não iniciado.')
  return WS
}