/* Interface da response do endpoint /lol-matchmaking/v1/ready-check */
export interface MatchmakingData {
  declinerIds: string[],
  dodgeWarning: string,
  playerResponse: string,
  state: string,
  suppressUx: boolean,
  timer: number
}

export interface ChampSelectData {
  localPlayerCellId: number
  bans: Bans
  actions: Action[][],
  theirTeam: SummonerPick[],
  myTeam: SummonerPick[]
}

export interface Bans {
  myTeamBans: number[],
  theirTeamBans: number[]
}

export interface Action {
  actorCellId: number,
  championId: number,
  completed: boolean,
  id: number,
  isAllyAction: boolean,
  isInProgress: boolean,
  pickTurn: number,
  type: string
}

export interface SummonerPick {
  championId: number
}

export interface CurrentSummoner {
  gameName: string,
  tagLine: string
}