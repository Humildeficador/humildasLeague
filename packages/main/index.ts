import path from 'path'
import { init } from './app'
import dotenv from 'dotenv'
import { app, BrowserWindow, ipcMain } from 'electron'

dotenv.config({
  path: path.resolve(__dirname, './.env')
})

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      // devTools: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  if (process.env.NODE_ENV === "development") {
    // Código para ambiente de desenvolvimento
    win.loadURL('http://localhost:5173/')
  } else if (process.env.NODE_ENV === "production") {
    // Código para ambiente de produção
    win.loadFile(path.join(__dirname, '../../renderer/index.html'))
    win.setMenu(null)
    win.removeMenu()
  }
}

app.whenReady().then(async () => {
  createWindow()
  await init()

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

ipcMain.handle('get-current-summoner', async (_, type: string, isEnable: boolean) => {
  const { handleCurrentSummoner } = await import('./app/lcu/handlers/handleCurrentSummoner')
  return await handleCurrentSummoner()
})

ipcMain.handle('is-authenticate', async (_, token: string, currentSummoner) => {
  const { authenticate } = await import('./app/authenticate/authenticate')
  return authenticate(token, currentSummoner)
})