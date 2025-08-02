import fs from 'node:fs/promises'
import config from '../utils/config.json'
import localChampionsData from '../utils/championsList.json'
import path from 'path'

interface ChampionsData {
  data: {
    name: string,
    key: string,
  }[]
}

export async function initUpdate() {
  const [version] = await (await fetch('https://ddragon.leagueoflegends.com/api/versions.json')).json()

  if (version !== config.version) {
    const configPath = path.resolve(__dirname, '../utils/config.json')
    const championsListPath = path.resolve(__dirname, '../utils/championsList.json')

    await fs.writeFile(configPath, JSON.stringify({ ...config, version: version }), null)

    const championsData: ChampionsData = await (await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`)).json()

    if (Object.values(championsData.data).length === localChampionsData.length) {
      return
    }

    const champions = Object.values(championsData.data).map(({ name, key }) => {
      return { name, id: Number(key), sprite: `${key}.png` }
    })

    const reorder = champions.sort((a, b) => {
      if (a.name > b.name) {
        return 1
      }
      if (a.name < b.name) {
        return -1
      }
      return 0
    })

    await fs.writeFile(championsListPath, JSON.stringify(reorder))


    const files = await fs.readdir('./assets')
    console.log(files)
  } else {
    console.log('No updates available')
  }

  if (!config.potatoMode) {
    /* for (const { id, sprite } of reorder) {
      const championIcon = await (await fetch(`https://ddragon.leagueoflegends.com/cdn/${config.version}/img/champion/${sprite}`)).arrayBuffer()

      await fs.writeFile(`./assets/${id}.png`, Buffer.from(championIcon))
    } */

    const championIcon = await (await fetch(`https://ddragon.leagueoflegends.com/cdn/${config.version}/img/champion/Aatrox.png`)).arrayBuffer()

    // console.log(path.resolve(__dirname, '../../../renderer/'))
    // await fs.writeFile(path.resolve(__dirname,))
  }
}
