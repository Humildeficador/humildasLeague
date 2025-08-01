import { Bans, SummonerPick } from '../../types/matchmaking'

interface DraftConfig {
  picks: number[],
  bans: number[]
}

const myDraftConfig: DraftConfig = {
  picks: [],
  bans: []
}

/* Faz filtragem dos bans para não tentar banir champ igual */
export function getChampionToBan(bans: Bans) {
  const myBans = myDraftConfig.bans

  const allBans = [...bans.myTeamBans, ...bans.theirTeamBans]

  return myBans.filter((v) => {
    if (!allBans.includes(v)) return v
  })[0]
}

/* Faz toda uma filtragem dos picks, verifica os picks disponiveis do summoner,
verifica os bans, os picks dos times e no final retorna o primeiro pick disponivel do array de picks pretendidos (ainda não implementei uma lógica caso não tenha sobrado nenhum pick) */
export function getChampionToPick(
  myTeam: SummonerPick[],
  theirTeam: SummonerPick[],
  pickableChampions: number[],
  bans: Bans
) {
  const myPicks = myDraftConfig.picks

  const allBans = [...bans.myTeamBans, ...bans.theirTeamBans]

  const myTeamPicks = myTeam.map(({ championId }) => championId)
  const theirTeamPicks = theirTeam.map(({ championId }) => championId)

  const teamsPicks = [...myTeamPicks, ...theirTeamPicks]

  const remaingPicks = myPicks.filter((v) =>
    !teamsPicks.includes(v) &&
    !allBans.includes(v) &&
    pickableChampions.includes(v)
  )[0]

  return remaingPicks
}

export function setDraftConfig({ picks, bans }: DraftConfig): void {
  myDraftConfig.picks = picks
  myDraftConfig.bans = bans

  console.log('Draft Config Updated:', myDraftConfig)
}