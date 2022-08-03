/* eslint-disable @typescript-eslint/consistent-type-definitions */

type CliOptions = {
  t?: boolean
  m?: string
  y?: string
  u?: string
  e?: string
}

type NumUnionBool = number | boolean

type dailyDistanceOrRunningLog = 'dailyDistance' | 'runningLog'

type EveryRunOptions = {
  t: boolean
  m: NumUnionBool
  y: NumUnionBool
  u: NumUnionBool
  e: NumUnionBool
}

type RunningLog = {
  id: number
  distance: number
  date: string
}

type DailyDistance = {
  id: number
  distance: number
}

type RunningLogParams = {
  distance: number
  dateString: string
}

export { CliOptions, EveryRunOptions, RunningLog, NumUnionBool, DailyDistance, RunningLogParams, dailyDistanceOrRunningLog }
