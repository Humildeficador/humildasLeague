import { handleReadyCheck } from '../../lcu/handlers/handleReadyCheck'
import { getLWSInstance } from '../../lcu/ws'

export function initAutoAccept(isEnable: boolean = false) {
  const ws = getLWSInstance()

  if (isEnable) {
    ws.subscribe('/lol-matchmaking/v1/ready-check', handleReadyCheck)
    console.log('Auto-Accept ativado.')
  } else {
    ws.unsubscribe('/lol-matchmaking/v1/ready-check')
    console.log('Auto-Accept desativado.')
  }
}