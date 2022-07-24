import { program } from 'commander'
import { CliOptions, EveryRunOptions } from './interfaces.js'

export class EveryRunOption {
  readonly #parameters: CliOptions
  constructor () {
    program
      .option('-t')
      .option('-m, --m <integer>')
      .option('-y, --y <integer>')
      .option('-u, --u <integer>')
      .option('-e, --e <integer>')
      .parse(process.argv)
    this.#parameters = program.opts()
    this.#inspectParameters()
  }

  #inspectParameters (): void {
    const entries = this.#extractEntries()
    if ((!this.#existYearAndMonth() && entries.length > 1) || (this.#existYearAndMonth() && entries.length > 2)) {
      console.log('オプションの指定が不正です。')
      process.exit()
    }
  }

  #extractEntries () {
    const parameters: Array<number | boolean> = []
    Object.values(this.parameters).forEach((parameter: number | boolean) => {
      if (this.#isEveryRunOptionEntry(parameter)) parameters.push(parameter)
    })

    return parameters.filter(parameter => parameter)
  }

  #isEveryRunOptionEntry (parameter: number | boolean): parameter is number | boolean {
    return (typeof parameter === 'number') || (typeof parameter === 'boolean')
  }

  #existYearAndMonth (): boolean {
    return (typeof this.parameters.y === 'number') && (typeof this.parameters.m === 'number')
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
    if (Number.isNaN(numberParam) || (numberParam <= 0)) {
      console.log('引数が不正です。0より大きい数値を指定してください。')
      process.exit()
    }
    return numberParam
  }
}
