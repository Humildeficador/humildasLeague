import { createHttp1Request } from 'league-connect';
import { credentials } from '../credentials';
import { CurrentSummoner } from '../../types/matchmaking';

export async function handleCurrentSummoner() {
  if (!credentials) return console.log('Dados de credenciais não disponíveis.')

  const currentSummoner = (await createHttp1Request({
    method: 'GET',
    url: '/lol-summoner/v1/current-summoner'
  }, credentials)).json<CurrentSummoner>()

  return {
    code: 200,
    gameName: currentSummoner.gameName,
    tagLine: currentSummoner.tagLine
  }
}