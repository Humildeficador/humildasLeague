import React from 'react'
// import styles from './ChampionItem.module.css'
import { GridItem, Image, Text } from '@chakra-ui/react'
import { useConfig } from '../../context/ConfigContext'

interface Props {
  name: string
  id: number
  sprite: string
  // superPotatoMode?: boolean | null
  tabSelected: string
  getChampionDetails: (name: string, id: number) => void
}

export const ChampionItem = React.memo((
  { name, id, sprite, getChampionDetails, tabSelected }: Props
) => {

  const { config } = useConfig()

  return (
    <GridItem
      onClick={() => getChampionDetails(name, id)}
      cursor={'pointer'}
      userSelect={'none'}
      h={20}
      w={20}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      {
        config && !config.potatoMode &&
        <Image
          alt={name}
          w={'70%'}
          src={`./championsIcon/${sprite}`}
        />
      }
      <Text fontSize={12} color={tabSelected === 'picks' ? 'cyan.600': 'orange.600'}>
        {name}
      </Text>
    </GridItem>
  )
})