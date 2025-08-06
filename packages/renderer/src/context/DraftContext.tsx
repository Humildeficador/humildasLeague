import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'


interface DraftData {
  champion: {
    name: string,
    id: number
  },
  type: 'pick' | 'ban'
}

interface ChampionsDraft {
  picks: { name: string, id: number }[]
  bans: { name: string, id: number }[]
}

interface DraftContext {
  championsList: ChampionsData[],
  championsDraft: ChampionsDraft,
  handleDraft: (data: DraftData) => void,
  handleRemoveChampInDraft: (data: DraftData) => void,
  handleResetDraft: () => void,
  handleSubmitDraft: () => void
}

const DraftContext = createContext<DraftContext | null>(null)

export function DraftProvider({ children }: { children: React.ReactNode }) {
  const [championsList, setChampionsList] = useState<ChampionsData[]>([])
  const [championsDraft, setChampionsDraft] = useState<ChampionsDraft>({
    picks: [],
    bans: []
  })

  useEffect(() => {
    (async () => {
      setChampionsList(await window.champions.getList())
    })()
  }, [])

  const handleDraft = useCallback((data: DraftData) => {
    console.log('a')
    if (data.type === 'pick') {
      if (championsDraft.picks.some(champ => champ.id === data.champion.id) || championsDraft.picks.length >= 5) return

      setChampionsDraft(prev => ({
        ...prev,
        picks: [...prev.picks, { name: data.champion.name, id: data.champion.id }]
      }))
    } else {
      if (championsDraft.bans.some(champ => champ.id === data.champion.id) || championsDraft.bans.length >= 5) return

      setChampionsDraft(prev => ({
        ...prev,
        bans: [...prev.bans, { name: data.champion.name, id: data.champion.id }]
      }))
    }
  }, [])

  const handleRemoveChampInDraft = useCallback((draft: DraftData) => {
    console.log(draft)
    if (draft.type === 'pick') {
      setChampionsDraft(prev => ({
        ...prev,
        picks: prev.picks.filter(champ => champ.id !== draft.champion.id)
      }))
    } else {
      setChampionsDraft(prev => ({
        ...prev,
        bans: prev.bans.filter(champ => champ.id !== draft.champion.id)
      }))
    }
  }, [])

  const handleResetDraft = useCallback(() => {
    setChampionsDraft({ picks: [], bans: [] })
    window.lcuAPI.setDraftConfig({ picks: [], bans: [] })
  }, [])

  const handleSubmitDraft = useCallback(() => {
    const picks = championsDraft.picks.map(champ => champ.id)
    const bans = championsDraft.bans.map(champ => champ.id)

    if (picks.length >= 1 || bans.length >= 1) {
      window.lcuAPI.setDraftConfig({ picks, bans })
    }
  }, [championsDraft.picks, championsDraft.bans])

  const value = useMemo(() => ({
    championsList,
    championsDraft,
    handleDraft,
    handleRemoveChampInDraft,
    handleResetDraft,
    handleSubmitDraft
  }), [championsList, championsDraft, handleDraft, handleRemoveChampInDraft, handleResetDraft, handleSubmitDraft])


  return (
    <DraftContext.Provider value={value}>
      {children}
    </DraftContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDraft() {
  const context = useContext(DraftContext)
  if (!context) throw new Error('useDraft tem que estar dentro do DraftProvider')
  return context
}