import { program } from 'commander'
import { CliOPtions, EveryRunOptions } from './interfaces/CliOptions.js'

export class EveryRunOption {
  readonly #parameters: CliOPtions
  constructor () {
    program
      .option('-t')
      .option('-m, --m <integer>')
      .option('-y, --y <integer>')
      .option('-u, --u <integer>')
      .option('-e, --e <integer>')
      .parse(process.argv)
    this.#parameters = program.opts()
  }

  get parameters (): EveryRunOptions {
    const { t, y, m, e, u } = this.#parameters
    return {
      t: t ?? false,
      y: this.#numberOrFalse(y),
      m: this.#numberOrFalse(m),
      e: this.#numberOrFalse(e),
      u: this.#numberOrFalse(u)
    }
  }

  #numberOrFalse (param: string | undefined) {
    if (!param) return false
    if (typeof param === 'boolean') return param

    const numberParam = Number(param)
    if (Number.isNaN(numberParam)) {
      console.log('オプション引数が不正です。数値を指定してください。')
      process.exit()
    }
    return numberParam
  }
}
