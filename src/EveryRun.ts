import * as readline from 'readline'
import { stdin as input, stdout as output } from 'process'
import { Runner } from './Runner.js'
import { EveryRunOptions } from './interfaces/CliOptions.js'
import { EveryRunOption } from './EveryRunOption.js'

export class EveryRun {
  static async start () {
    try {
      const distance = await this.askDistance()
      const er = new EveryRun(distance, new EveryRunOption().parameters)
      er.#start()
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        process.exit(1)
      }
    }
  }

  static askDistance () {
    return new Promise<number>((resolve, reject) => {
      const rl = readline.createInterface({ input, output })
      rl.question('How many kilometer do you run a day?\n', answer => {
        if (this.#isInvalidAnswer(answer)) reject(new Error(`${answer} is invalid. Please input a number\n greater than 0 \n or less equal than 20.`))
        resolve(Number(answer))
        rl.close()
      })
    })
  }

  static #isInvalidAnswer (answer: string): boolean {
    return Number.isNaN(Number(answer)) || Number(answer) <= 0 || Number(answer) > 20
  }

  #runner: Runner
  #options: EveryRunOptions
  constructor (distance: number, options: EveryRunOptions) {
    this.#runner = new Runner(distance)
    this.#options = options
  }

  #start () {
    console.log(`Good Luck! You set the ${this.#runner.targetDistance} as your goal.`)
  }
}
