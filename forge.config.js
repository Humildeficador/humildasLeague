const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const { create } = require('domain');
const { win32 } = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    name: 'Humildas League',
    executableName: 'humildas-league',
    icon: './assets/icon',
    shortcutName: 'Humildas League',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'humildas-league',
        authors: 'Humildeficador',
        description: 'A desktop application for managing Humildas League matches.',
        setupIcon: './assets/icon.ico',
        setupExe: 'HumildasLeagueSetup-2.0.0.exe',
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: 'Humildas League', // <-- aqui está correto
        noMsi: true
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
