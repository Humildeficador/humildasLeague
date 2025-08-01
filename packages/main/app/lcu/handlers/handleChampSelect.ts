import { config } from '../../services/champSelect/champSelect'
import { getChampionToBan, getChampionToPick } from '../../services/champSelect/logic'
import { extractDataFromActions, isMyAction } from '../../services/champSelect/utils'
import { ChampSelectData } from '../../types/matchmaking'
import { credentials } from '../credentials'
import { createHttp1Request } from 'league-connect'


/* Uso todas as funções aqui para criar o handler (já está comentado no proprios arquivos delas), caso passe por toda a lógica cria o httpRequest */
export async function handleChampSelect(data: ChampSelectData | null) {
  if (!data || !credentials) return console.log('Dados de matchmaking não fornecidos ou credenciais não disponíveis.')

  const actions = extractDataFromActions(data)
  const myAction = isMyAction(actions, data.localPlayerCellId)

  if (!myAction) return

  // if (myAction.type === 'ban' && permission >= 2) {
  if (myAction.type === 'ban' && config['ban']) {
    const championToBan = getChampionToBan(data.bans)

    /* Faz a requisição de ban com o id da ação e do champion */
    await createHttp1Request({
      method: 'PATCH',
      url: `/lol-champ-select/v1/session/actions/${myAction.id}`,
      body: {
        completed: true,
        championId: championToBan
      }
    }, credentials)
  }

  // if (myAction.type === 'pick' && permission <= 2) {
  if (myAction.type === 'pick' && config['pick']) {
    /* Busca a lista de pickableChampions do summoner */
    const pickableChampions = (await createHttp1Request({
      method: 'GET',
      url: '/lol-champ-select/v1/pickable-champion-ids'
    }, credentials)).json<number[]>()

    const championToPick = getChampionToPick(
      data.myTeam,
      data.theirTeam,
      pickableChampions,
      data.bans
    )

    /* Faz requisição de pick com id da ação e do champion */
    await createHttp1Request({
      method: 'PATCH',
      url: `/lol-champ-select/v1/session/actions/${myAction.id}`,
      body: {
        completed: true,
        championId: championToPick
      }
    }, credentials)
  }
}