import * as readline from 'readline'
import { stdin as input, stdout as output } from 'process'
import { Runner } from './Runner.js'
import { EveryRunOptions } from './interfaces/CliOptions.js'

export class EveryRun {
  static async start (options: EveryRunOptions) {
    const er = new EveryRun(options)
    await er.#start()
  }

  #options: EveryRunOptions
  constructor (options: EveryRunOptions) {
    this.#options = options
  }

  async #start () {
    if (this.#options.t) {
      this.#readTotalLog()
    } else if (this.#options.y) {
      this.#readYearlyLog()
    } else if (this.#options.m) {
      this.#readMonthlyLog()
    } else if (this.#options.e) {
      this.#insertExtraLog()
    } else if (this.#options.u) {
      this.#updateDailyGoal()
    } else {
      await this.#firstOrCreate()
    }
  }

  #readTotalLog () {
    console.log('Show your total running log.')
  }

  #readYearlyLog () {
    console.log(`Show your ${Number(this.#options.y)}'s total running log`)
  }

  #readMonthlyLog () {
    console.log(`Show your ${Number(this.#options.m)}'s total running log`)
  }

  #insertExtraLog () {
    console.log(`Fantastic!! You've reached ${Number(this.#options.e)} km.`)
  }

  #updateDailyGoal () {
    console.log('How many kilometer do you run a day?')
  }

  async #firstOrCreate () {
    if (this.#existRunner()) {
      console.log("Congratulation! You've reached your daily goal.")
    } else {
      const distance = await this.#askDistance()
      const runner = new Runner(distance)
      console.log(`Good Luck! You set the ${runner.targetDistance} as your daily goal.`)
    }
  }

  #existRunner (): boolean {
    return true
  }

  #askDistance () {
    return new Promise<number>((resolve, reject) => {
      const rl = readline.createInterface({ input, output })
      rl.question('How many kilometer do you run a day?\n', answer => {
        if (this.#isInvalidAnswer(answer)) reject(new Error(`${answer} is invalid. Please input a number\n greater than 0 \n or less equal than 20.`))
        resolve(Number(answer))
        rl.close()
      })
    })
  }

  #isInvalidAnswer (answer: string): boolean {
    return Number.isNaN(Number(answer)) || Number(answer) <= 0 || Number(answer) > 20
  }
}
