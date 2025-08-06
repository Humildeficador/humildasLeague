import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('lcuAPI', {
  autoAccept: async (isEnable: boolean) => {
    return ipcRenderer.invoke('get-ready-check', isEnable)
  },
  champSelect: async (type: string, isEnable: boolean) => {
    return ipcRenderer.invoke('get-champ-select', type, isEnable)
  },
  currentSummoner: async () => {
    return ipcRenderer.invoke('get-current-summoner')
  },
  setDraftConfig: (config: { picks: number[], bans: number[] }) => {
    return ipcRenderer.invoke('set-draft-config', config)
  }
})

contextBridge.exposeInMainWorld('authenticate', {
  verify: async (token: string, currentSummoner: { gameName: string, tagLine: string }) => {
    return ipcRenderer.invoke('is-authenticate', token, currentSummoner)
  }
})

contextBridge.exposeInMainWorld('config', {
  getConfig: async () => {
    return ipcRenderer.invoke('get-config')
  }
})

contextBridge.exposeInMainWorld('champions', {
  getList: async () => {
    return ipcRenderer.invoke('get-list')
  }
})