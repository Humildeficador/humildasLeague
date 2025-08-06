/// <reference types="vite/client" />

interface Window {
  lcuAPI: {
    autoAccept: (isEnable: boolean) => Promise<boolean>,
    champSelect: (type: string, isEnable: boolean) => Promise<void>,
    currentSummoner: () => Promise<{ code: number, gameName: string, tagLine: string }>,
    setDraftConfig: (config: { picks: number[], bans: number[] }) => Promise<void>
  }
  authenticate: {
    verify: (token: string, currentSummoner: { gameName: string, tagLine: string }) => Promise<Authenticate>
  },
  config: {
    getConfig: () => Promise<Config>
  }
  champions: {
    getList: () => Promise<ChampionsData[]>,
  }
}

interface Authenticate {
  code: number,
  error?: string,
  message?: string,
  name?: string,
  accounts?: string[]
}

interface ChampionsData {
  name: string,
  id: number,
  sprite: string
}

interface Config {
  description: string,
  draftConfig: {
    picks: {
      enable: boolean,
      picks: number[]
    },
    bans: {
      enable: boolean,
      bans: number[]
    }
  },
  autoAccept: boolean,
  potatoMode: boolean,
  hasImages: boolean,
  version: string
}