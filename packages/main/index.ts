import path from 'path'
import { init } from './app'
import { app, BrowserWindow, ipcMain, net, protocol, shell } from 'electron'
import { updateElectronApp } from 'update-electron-app'

if (require('electron-squirrel-startup')) app.quit()

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      devTools: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  win.loadFile(path.join(__dirname, '../../renderer/index.html'))
  win.webContents.setWindowOpenHandler((details) => {
  shell.openExternal(details.url)
  return { action: 'deny' }
})
}

app.whenReady().then(async () => {
  protocol.handle('local', (request) => {
    const fileName = request.url.replace('local://', '')
    const userDataPath = app.getPath('userData')
    const filePath = path.join(userDataPath, 'assets', fileName)
    return net.fetch('file://' + filePath)
  })

  

  await init()
  createWindow()
  updateElectronApp()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('get-ready-check', async (_, isEnable: boolean) => {
  const { initAutoAccept } = await import('./app/services/autoAccept/autoAccept')
  return initAutoAccept(isEnable)
})

ipcMain.handle('get-champ-select', async (_, type: string, isEnable: boolean) => {
  const { initChampSelect } = await import('./app/services/champSelect/champSelect')
  return initChampSelect(type, isEnable)
})

ipcMain.handle('set-draft-config', async (_, config) => {
  const { setDraftConfig } = await import('./app/services/champSelect/logic')
  setDraftConfig(config)
})

ipcMain.handle('get-list', async () => {
  const { getChampionList } = await import('./app/services/getChampionList/getChampionList')
  return getChampionList()
})

ipcMain.handle('get-current-summoner', async (_, type: string, isEnable: boolean) => {
  const { handleCurrentSummoner } = await import('./app/lcu/handlers/handleCurrentSummoner')
  return await handleCurrentSummoner()
})