import { Flex, Spinner, Stack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { ChampionSearch } from './components/ChampionSearch/ChampionSearch'
import { EnablePlugin } from './components/EnablePlugin/EnablePlugin'
import { getCurrentSummoner } from './services/summoner'
import { isEqual } from 'lodash'

interface CurrentSummonerType {
  code: number,
  gameName: string,
  tagLine: string
}

export function App() {
   const [currentSummoner, setCurrentSummoner] = useState<CurrentSummonerType>()

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    async function verifyAuth() {
      const summoner = await getCurrentSummoner()
      setCurrentSummoner(prev => isEqual(prev, summoner) ? prev : summoner)
    }

    verifyAuth()
    interval = setInterval(verifyAuth, 1000 * 5)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {currentSummoner ?
        <Flex justifyContent={'end'} mt={-2} pb={1} color={'cyan.500'} h={'24px'}>
          {currentSummoner.gameName}{`#`}{currentSummoner.tagLine}
        </Flex> :
        <Flex justifyContent={'end'} mt={-2} pb={1} color={'cyan.500'} h={'24px'}>
          <Spinner color={'cyan.500'} animationDuration={'0.8s'} mr={2} />
        </Flex>
      }

        <Flex justifyContent={'space-between'}>
          <div>
            <Stack w={'150px'} maxW={'220px'}>
              <EnablePlugin type='accept' />
              <EnablePlugin type='pick' />
              <EnablePlugin type='ban' />
            </Stack>
          </div>
          <ChampionSearch />
        </Flex>
    </>
  )
}