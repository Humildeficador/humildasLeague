import { Action, ChampSelectData } from '../../types/matchmaking'

/* Extrai dados do data e retona somente um array de objeto */
export function extractDataFromActions(data: ChampSelectData) {
  return data.actions.flat().map((
    {
      id,
      type,
      pickTurn,
      completed,
      championId,
      actorCellId,
      isInProgress,
      isAllyAction
    }
  ) => {
    return {
      id,
      type,
      pickTurn,
      completed,
      championId,
      actorCellId,
      isInProgress,
      isAllyAction
    }
  })
}

/* Verifica se no array de açoes .actorCellId corresponde ao cellId do summoner */
export function isMyAction(actions: Action[], myCellId: number) {
  return actions.find(action =>
    action.actorCellId === myCellId &&
    action.isInProgress &&
    action.isAllyAction &&
    !action.completed
  )
}