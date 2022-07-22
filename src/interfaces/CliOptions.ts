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

export { CliOptions, EveryRunOptions }
