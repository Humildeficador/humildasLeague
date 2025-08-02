import React from 'react'
// import styles from './ChampionItem.module.css'
import { GridItem, Image, Text } from '@chakra-ui/react'

interface Props {
  name: string
  id: number
  sprite: string
  superPotatoMode?: boolean
  tabSelected: string
  getChampionDetails: (name: string, id: number) => void
}

export const ChampionItem = React.memo((
  { name, id, sprite, getChampionDetails, superPotatoMode = true, tabSelected }: Props
) => {

console.log(tabSelected)

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
        !superPotatoMode &&
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