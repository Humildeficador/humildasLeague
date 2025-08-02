import { initLWS } from './lcu/ws'
import { initUpdate } from './update/update'
import { getChampionList } from './services/getChampionList/getChampionList'

export async function init() {
  await initLWS()
  await initUpdate()
  await getChampionList()
}