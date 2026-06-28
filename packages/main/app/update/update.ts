import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'path'
import { app } from 'electron'

interface Champion {
  name: string
  key: string
  image: {
    full: string
  }
}

interface ChampionsData {
  data: Record<string, Champion>
}

function readJSONFileSync<T>(filePath: string, defaultValue: T): T {
  try {
    const data = fsSync.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      fsSync.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    console.error(`Error reading file ${filePath}:`, error);
    return defaultValue;
  }
}

export async function initUpdate() {
  const userDataPath = app.getPath('userData');
  const configPath = path.join(userDataPath, 'config.json');
  const championsListPath = path.join(userDataPath, 'championsList.json');
  const assetsPath = path.join(userDataPath, 'assets');

  await fs.mkdir(assetsPath, { recursive: true });

  const config = readJSONFileSync(configPath, { version: "1.0.0" });
  
  const [version] = await (await fetch('https://ddragon.leagueoflegends.com/api/versions.json')).json()

  if (version === config.version) {
    const localChampionsData: any[] = readJSONFileSync(championsListPath, []);
    const downloadedImages = await fs.readdir(assetsPath).catch(() => []);
    
    if (localChampionsData.length > 0 && downloadedImages.length >= localChampionsData.length) {
       return; 
    }
  }

  await fs.writeFile(configPath, JSON.stringify({ ...config, version: version }, null, 2));

  const championsData: ChampionsData = await (await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`)).json()

  const champions = Object.values(championsData.data).map((champ) => ({
    name: champ.name,
    id: Number(champ.key),
    sprite: champ.image.full
  }))

  const reorder = champions.sort((a, b) => a.name.localeCompare(b.name));

  await fs.writeFile(championsListPath, JSON.stringify(reorder, null, 2));

  for (const { name, id, sprite } of reorder) {
    const imagePath = path.join(assetsPath, sprite);
    
    if (!fsSync.existsSync(imagePath)) {
      try {
        const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${sprite}`);
        const buffer = await response.arrayBuffer();
        await fs.writeFile(imagePath, Buffer.from(buffer));
      } catch (error) {
        console.error(`Failed to download icon for ${name}:`, error);
      }
    }
  }
}