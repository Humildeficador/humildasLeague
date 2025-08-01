/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { ChampionItem } from './ChampionItem'
import styles from './ChampionList.module.css'
import championList from '../../utils/championsList.json'
import { toast, ToastContainer, Slide } from 'react-toastify'
import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react'

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
  const [champions, setChampions] = useState(championList)
  const [selectedChampions, setSelectedChampions] = useState<SelectedChampion>({
    picks: [],
    bans: []
  })

  useEffect(() => {
    const picks = selectedChampions.picks.map(champ => champ.id)
    const bans = selectedChampions.bans.map(champ => champ.id)
    window.lcuAPI.setDraftConfig({ picks, bans })
  }, [])

  useEffect(() => {
    const filtered = championList.filter(champion =>
      champion.name.replace(/\W/g, '').toLowerCase().includes(searchChamp.toLowerCase())
    )
    setChampions(filtered)
  }, [searchChamp])

  function handleSelectChamp(name: string, id: number) {
    if (tabSelected === 'picks') {
      if (selectedChampions.picks.some(champ => champ.id === id) || selectedChampions.picks.length >= 5) return
      setSelectedChampions(prev => ({
        ...prev,
        picks: [...prev.picks, { name, id }]
      }))
    } else {
      if (selectedChampions.bans.some(champ => champ.id === id) || selectedChampions.bans.length >= 5) return
      setSelectedChampions(prev => ({
        ...prev,
        bans: [...prev.bans, { name, id }]
      }))
    }
    setSearchChamp('')
  }

  function handleRemoveChamp(id: number) {
    if (tabSelected === 'picks') {
      setSelectedChampions(prev => ({
        ...prev,
        picks: prev.picks.filter(champ => champ.id !== id)
      }))
    } else {
      setSelectedChampions(prev => ({
        ...prev,
        bans: prev.bans.filter(champ => champ.id !== id)
      }))
    }
  }

  function handleSubmitDraftConfig() {
    const picks = selectedChampions.picks.map(champ => champ.id)
    const bans = selectedChampions.bans.map(champ => champ.id)
    if (selectedChampions.picks.length >= 1) {
      window.lcuAPI.setDraftConfig({ picks, bans })
    } else if (selectedChampions.bans.length >= 1) {
      window.lcuAPI.setDraftConfig({ picks, bans })
    }
    notify()
  }


  const notify = () => toast('Lista Atualizada!', {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Slide,
  });

  return (
    <Box w={500}>
      <Button position={'absolute'} zIndex={2} bottom={0} left={-230} w={148} onClick={handleSubmitDraftConfig}>
        Confirmar Draft
      </Button>
      {
        tabSelected === 'picks' ?
          <Stack position={'absolute'} top={200} left={-230} zIndex={1} w={148} border={'2px solid'} borderColor={'cyan.700'} borderRadius={5} p={2}>
            {selectedChampions.picks.length > 0 ?
              selectedChampions.picks.map(({ name, id }) => (
                <Text
                  color={'cyan.500'}
                  fontWeight={'medium'}
                  textShadow={'2px 2px 10px cyan'}
                  textDecoration={'underline'}
                  key={id}
                  onClick={() => { handleRemoveChamp(id) }}
                  className={styles.item}>
                  {name}
                </Text>
              )) :
              <Text
                color={'cyan.500'}
                fontWeight={'medium'}
                textShadow={'2px 2px 10px cyan'}>
                Escolha os picks
              </Text>
            }
          </Stack> :
          <Stack position={'absolute'} top={200} left={-230} zIndex={1} w={148} border={'2px solid'} color={'orange.700'} borderRadius={5} p={2}>
            {selectedChampions.bans.length > 0 ?
              selectedChampions.bans.map(({ name, id }) => (
                <Text
                  textDecoration={'line-through'}
                  color={'orange.700'}
                  fontWeight={'medium'}
                  textShadow={'2px 2px 10px red'}
                  key={id}
                  onClick={() => { handleRemoveChamp(id) }}
                  className={styles.item}>
                  {name}
                </Text>
              )) :
              <Text
                color={'orange.700'}
                fontWeight={'medium'}
                textShadow={'2px 2px 10px red'}>
                Escolha os bans
              </Text>
            }
          </Stack>
      }
      <Flex direction={'column'} gap={2} ml={2} h={400} overflowY={'auto'}>
        {champions.map(champion => (
          <ChampionItem key={champion.id} name={champion.name} id={champion.id} getChampionDetails={handleSelectChamp} />
        ))}
      </Flex>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        limit={1}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
        toastStyle={{ marginBottom: '-20px'}}
      />
    </Box >
  )
}