/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Flex, Grid, Stack, Text, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Slide, toast, ToastContainer } from 'react-toastify'
import { ChampionItem } from './ChampionItem'
import styles from './ChampionList.module.css'
import { FaCheck, FaTimes } from 'react-icons/fa'

interface ChampionListProps {
  searchChamp: string
  tabSelected: string
  setSearchChamp: (value: string) => void
}

interface SelectedChampion {
  picks: { name: string, id: number }[]
  bans: { name: string, id: number }[]
}

export function ChampionList({ searchChamp, tabSelected, setSearchChamp }: ChampionListProps) {
  const [championsList, setChampionsList] = useState<any[]>([])
  const [filtredChampions, setFiltredChampions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChampions, setSelectedChampions] = useState<SelectedChampion>({
    picks: [],
    bans: []
  })

  async function loadData() {
    setIsLoading(true)
    const list = await window.champions.getList()
    setChampionsList(list)
    setFiltredChampions(list)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const filtered = championsList.filter(champion =>
      champion.name.replace(/\W/g, '').toLowerCase().includes(searchChamp.toLowerCase())
    )
    setFiltredChampions(filtered)
  }, [searchChamp])

  function handleSelectChamp(name: string, id: number) {
    if (tabSelected === 'picks') {
      if (selectedChampions.picks.some(champ => champ.id === id) || selectedChampions.picks.length >= 5) return
      setSelectedChampions(prev => ({ ...prev, picks: [...prev.picks, { name, id }] }))
    } else {
      if (selectedChampions.bans.some(champ => champ.id === id) || selectedChampions.bans.length >= 5) return
      setSelectedChampions(prev => ({ ...prev, bans: [...prev.bans, { name, id }] }))
    }
    setSearchChamp('')
  }

  function handleRemoveChamp(id: number) {
    if (tabSelected === 'picks') {
      setSelectedChampions(prev => ({ ...prev, picks: prev.picks.filter(c => c.id !== id) }))
    } else {
      setSelectedChampions(prev => ({ ...prev, bans: prev.bans.filter(c => c.id !== id) }))
    }
  }

  function handleSubmitDraftConfig() {
    const picks = selectedChampions.picks.map(c => c.id)
    const bans = selectedChampions.bans.map(c => c.id)
    window.lcuAPI.setDraftConfig({ picks, bans })
    notify()
  }

  function handleResetDraft() {
    setSelectedChampions({ picks: [], bans: [] })
    window.lcuAPI.setDraftConfig({ picks: [], bans: [] })
  }

  const notify = () => toast('Lista Atualizada!', {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    transition: Slide,
  });

  if (isLoading) {
    return (
      <Flex w={500} h={400} justify="center" align="center" color="cyan.500">
        <Spinner size="xl" />
      </Flex>
    )
  }

  return (
    <Box w={500}>
      <Flex position={'absolute'} zIndex={2} bottom={0} left={-230} w={148} justifyContent={'space-between'} >
        <Button onClick={handleSubmitDraftConfig} w={'45%'} background={'cyan.500'} _hover={{ background: 'cyan.600' }}><FaCheck /></Button>
        <Button onClick={handleResetDraft} w={'45%'} background={'orange.600'} _hover={{ background: 'orange.700' }}><FaTimes /></Button>
      </Flex>
      
      {tabSelected === 'picks' ? (
        <Stack position={'absolute'} top={200} left={-230} zIndex={1} w={148} border={'2px solid'} borderColor={'cyan.700'} borderRadius={5} p={2}>
          {selectedChampions.picks.length > 0 ? selectedChampions.picks.map(({ name, id }) => (
            <Text key={id} color={'cyan.500'} onClick={() => handleRemoveChamp(id)} className={styles.item}>{name}</Text>
          )) : <Text color={'cyan.500'}>Escolha os picks</Text>}
        </Stack>
      ) : (
        <Stack position={'absolute'} top={200} left={-230} zIndex={1} w={148} border={'2px solid'} color={'orange.700'} borderRadius={5} p={2}>
          {selectedChampions.bans.length > 0 ? selectedChampions.bans.map(({ name, id }) => (
            <Text key={id} color={'orange.700'} onClick={() => handleRemoveChamp(id)} className={styles.item}>{name}</Text>
          )) : <Text color={'orange.700'}>Escolha os bans</Text>}
        </Stack>
      )}

      <Box h={400}>
        <Grid maxH={400} gap={2} templateColumns={'repeat(5, 1fr)'} overflowY={'auto'}>
          {filtredChampions.map(champion => (
            <ChampionItem
              key={champion.id}
              name={champion.name}
              id={champion.id}
              sprite={champion.sprite}
              getChampionDetails={handleSelectChamp}
              tabSelected={tabSelected}
            />
          ))}
        </Grid>
      </Box>
      <ToastContainer position="bottom-center" autoClose={2000} theme="dark" transition={Slide} />
    </Box>
  )
}