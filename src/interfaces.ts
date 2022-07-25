interface CliOptions {
  t?: boolean
  m?: string
  y?: string
  u?: string
  e?: string
}

type NumUnionBool = number | boolean

type dailyDistanceOrRunningLog = 'dailyDistance' | 'runningLog'

interface EveryRunOptions {
  t: boolean
  m: NumUnionBool
  y: NumUnionBool
  u: NumUnionBool
  e: NumUnionBool
}

interface RunningLog {
  id: number
  distance: number
  date: string
}

interface DailyDistance {
  id: number
  distance: number
}

interface RunningLogParams {
  distance: number
  dateString: string
}

export { CliOptions, EveryRunOptions, RunningLog, NumUnionBool, DailyDistance, RunningLogParams, dailyDistanceOrRunningLog }
