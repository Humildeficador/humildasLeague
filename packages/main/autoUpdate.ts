import { autoUpdater } from 'electron-updater';

export function setupAutoUpdater() {
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('checking-for-update', () => {
    console.log('🔍 Procurando por updates...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('🚀 Update disponível:', info.version);
  });

  autoUpdater.on('update-not-available', () => {
    console.log('✅ App já está na última versão.');
  });

  autoUpdater.on('download-progress', (progressObj) => {
    console.log(`📥 Baixando update: ${Math.round(progressObj.percent)}%`);
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('📦 Update baixado, pronto para instalar.');
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on('error', (err) => {
    console.error('❌ Erro no update:', err);
  });
}
