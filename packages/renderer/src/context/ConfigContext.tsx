import { createContext, useContext, useEffect, useState } from 'react'

type ConfigContextType = {
  config: Config | null,
  setConfig?: (config: Config) => number
}

const ConfigContext = createContext<ConfigContextType | null>(null)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    async function getInitialConfig() {
      setConfig(await window.config.getConfig())
    }
    getInitialConfig()
  }, [])

  return (
    <ConfigContext.Provider value={{
      config: config
    }}>
      {children}
    </ConfigContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfig() {
  const context = useContext(ConfigContext)
  if (context === null) throw new Error('useConfig tem que estar dentro do ConfigProvider')
  return context
}