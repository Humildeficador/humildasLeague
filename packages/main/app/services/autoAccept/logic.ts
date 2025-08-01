import { MatchmakingData } from '../../types/matchmaking'

const userReadyCheck = {
  hasAccepted: false
}

export function getReadyCheck(data: MatchmakingData) {
  /* Verifica se achou partida, caso não define .hasAccepted false */
  if (data.state !== 'InProgress') {
    userReadyCheck.hasAccepted
  }

  /* Caso o player tenha aceitado define .hasAccepted true */
  if (data.playerResponse === 'Accepted') {
    userReadyCheck.hasAccepted = true
  } else {
    /* Qualquer caso diferente define .hasAccepted false */
    userReadyCheck.hasAccepted = false
  }

  return userReadyCheck.hasAccepted
}