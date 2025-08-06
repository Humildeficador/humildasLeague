/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Flex, Grid, Stack, Text } from '@chakra-ui/react'
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
  const [championsList, setChampionsList] = useState<ChampionsData[]>([])
  const [filtredChampions, setFiltredChampions] = useState<ChampionsData[]>([])
  const [selectedChampions, setSelectedChampions] = useState<SelectedChampion>({
    picks: [],
    bans: []
  })

  useEffect(() => {
    const picks = selectedChampions.picks.map(champ => champ.id)
    const bans = selectedChampions.bans.map(champ => champ.id)
    window.lcuAPI.setDraftConfig({ picks, bans })
    getConfig()
  }, [])

  useEffect(() => {
    const filtered = championsList.filter(champion =>
      champion.name.replace(/\W/g, '').toLowerCase().includes(searchChamp.toLowerCase())
    )
    setFiltredChampions(filtered)
  }, [searchChamp])

  async function getConfig() {
    setChampionsList(await window.champions.getList())
    setFiltredChampions(await window.champions.getList())
  }

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

  function handleResetDraft() {
    setSelectedChampions({
      picks: [],
      bans: []
    })

    window.lcuAPI.setDraftConfig({ picks: [], bans: [] })
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
      <Flex position={'absolute'} zIndex={2} bottom={0} left={-230} w={148} justifyContent={'space-between'} >
        <Button onClick={handleSubmitDraftConfig} w={'2/5'} background={'cyan.500'} _hover={{ background: 'cyan.600' }}>
          <FaCheck />
        </Button>
        <Button onClick={handleResetDraft} w={'2/5'} background={'orange.600'} _hover={{ background: 'orange.700' }}>
          <FaTimes />
        </Button>
      </Flex>
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
      <Box h={400}>
        <Grid
          maxH={400}
          gap={2}
          templateColumns={'repeat(5, 1fr)'}
          overflowY={'auto'}
          justifyContent={'space-between'}
        >
          {filtredChampions.map(champion => (
            <ChampionItem
              key={champion.id}
              name={champion.name}
              id={champion.id}
              sprite={champion.sprite}
              getChampionDetails={handleSelectChamp}
              tabSelected={tabSelected}
            />
          ))
          }
        </Grid>
      </Box>
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
        toastStyle={{ marginBottom: '-20px' }}
      />
    </Box >
  )
}