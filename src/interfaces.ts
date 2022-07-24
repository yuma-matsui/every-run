interface CliOptions {
  t?: boolean
  m?: string
  y?: string
  u?: string
  e?: string
}

type NumUnionBool = number | boolean

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

export { CliOptions, EveryRunOptions, RunningLog, NumUnionBool, DailyDistance }
