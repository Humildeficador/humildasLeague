/// <reference types="vite/client" />

interface Window {
  lcuAPI: {
    autoAccept: (isEnable: boolean) => Promise<boolean>,
    champSelect: (type: string, isEnable: boolean) => Promise<void>,
    currentSummoner: () => Promise<{ code: number, gameName: string, tagLine: string }>,
    setDraftConfig: (config: { picks: number[], bans: number[] }) => Promise<void>
  }
  authenticate: {
    /* verify: (token: string, currentSummoner: { gameName: string, tagLine: string }) => Promise<string | boolean>, */
    verify: (token: string, currentSummoner: { gameName: string, tagLine: string }) => Promise<AutenticatePromise>
  }
}

interface AutenticatePromise {
  code: number,
  error?: string,
  message?: string,
  name?: string,
  accounts?: string[]
}