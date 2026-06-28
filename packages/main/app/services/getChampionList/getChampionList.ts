import fs from 'node:fs/promises'
import path from 'path'
import { app } from 'electron'

export async function getChampionList() {
  const userDataPath = app.getPath('userData')
  const championsListPath = path.join(userDataPath, 'championsList.json')

  try {
    const data = await fs.readFile(championsListPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}