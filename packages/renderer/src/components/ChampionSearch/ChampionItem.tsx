import React from 'react'
import styles from './ChampionItem.module.css'

interface Props {
  name: string
  id: number
  getChampionDetails: (name: string, id: number) => void
}

export const ChampionItem = React.memo(({ name, id, getChampionDetails }: Props) => {
  return (
    <div onClick={() => getChampionDetails(name, id)} className={styles.item}>
      <span>{name}</span>
    </div>
  )
})