import { credentials } from '../credentials'
import { createHttp1Request } from 'league-connect'
import { MatchmakingData } from '../../types/matchmaking'
import { getReadyCheck } from '../../services/autoAccept/logic'

export async function handleReadyCheck(data: MatchmakingData | null) {
  if (!data || !credentials) return console.log('Dados de matchmaking não fornecidos ou credenciais não disponíveis.')

  const isAccepted = getReadyCheck(data)

  if (isAccepted) return 'O invocador já aceitou a partida.'

  const res = await createHttp1Request({
    method: 'POST',
    url: '/lol-matchmaking/v1/ready-check/accept'
  }, credentials)

  if (res.status !== 204) {
    throw new Error('Falha ao aceitar a partida.')
  }
  
  return 'Partida aceita com sucesso.'
}