import React, { useState } from 'react'
// import styles from './ChampionItem.module.css'
import { GridItem, Image, Spinner, Text } from '@chakra-ui/react'

interface Props {
  name: string
  id: number
  sprite: string
  tabSelected: string
  getChampionDetails: (name: string, id: number) => void
}

export const ChampionItem = React.memo((
  { name, id, sprite, getChampionDetails, tabSelected }: Props
) => {
  const [isLoaded, setIsLoaded] = useState(false)

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
        <Image
          alt={name}
          w={'70%'}
          src={`local://${sprite}`}
          onLoad={() => setIsLoaded(true)}
          opacity={isLoaded ? 1 : 0}
          transition="opacity 0.2s" // Fica suave
        />
        {!isLoaded && <Spinner size="xs" color="gray.500" />}
      <Text fontSize={12} color={tabSelected === 'picks' ? 'cyan.600': 'orange.600'}>
        {name}
      </Text>
    </GridItem>
  )
})