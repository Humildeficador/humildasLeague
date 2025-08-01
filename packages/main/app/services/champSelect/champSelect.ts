import { getLWSInstance } from '../../lcu/ws'
import { handleChampSelect } from '../../lcu/handlers/handleChampSelect'

type ConfigType = {
  [key: string]: boolean
}

export const config: ConfigType = {
  pick: false,
  ban: false,
}

export async function initChampSelect(type: string, isEnable: boolean) {
  config[type] = isEnable

  const ws = getLWSInstance()

  console.log(`Auto-${type.charAt(0).toUpperCase() + type.slice(1)} ${isEnable ? 'ativado' : 'desativado'}`)
  
  if (config['pick'] || config['ban']) {
    ws.subscribe('/lol-champ-select/v1/session', (data) => {
      handleChampSelect(data)
    })
  } else {
    ws.unsubscribe('/lol-champ-select/v1/session')
  }
}