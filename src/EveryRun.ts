import * as readline from 'readline'
import { stdin as input, stdout as output } from 'process'
import { EveryRunOptions } from './interfaces/CliOptions.js'
import { EveryRunDB } from './EveryRunDB.js'

export class EveryRun {
  static async start (options: EveryRunOptions, db: EveryRunDB) {
    const er = new EveryRun(options, db)
    await er.#start()
  }

  #options: EveryRunOptions
  #db: EveryRunDB
  constructor (options: EveryRunOptions, db: EveryRunDB) {
    this.#options = options
    this.#db = db
  }

  async #start () {
    try {
      if (!(await this.#existRunner())) {
        await this.#createRunner()
        return
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        process.exit()
      }
    }

    await this.#runOption()
  }

  async #existRunner () {
    const runners = await this.#db.all('runner')
    return runners.length === 1
  }

  async #createRunner () {
    try {
      const distance = await this.#askDistance()
      this.#db.insertRunner(distance)
      console.log(`1日の目標距離を${distance}kmに設定しました。`)
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        process.exit()
      }
    } finally {
      this.#db.close()
    }
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

  async #runOption () {
    if (this.#options.t) {
      this.#readTotalLog()
    } else if (this.#options.y || this.#options.m) {
      this.#readPeriodLog()
    } else if (this.#options.e) {
      this.#insertExtraLog()
    } else if (this.#options.u) {
      this.#updateDailyGoal()
    } else {
      await this.#insertDailyLog()
    }
  }

  #readTotalLog () {
    console.log('これまでの全走行距離を返します')
  }

  #readPeriodLog () {
    console.log('指定した年、月の走行距離を返します')
  }

  #insertExtraLog () {
    console.log('いつもより多く走れました')
  }

  #updateDailyGoal () {
    console.log('1日の目標距離を変更します')
  }

  async #insertDailyLog () {
    try {
      const distance = await this.#db.getDailyGoal()
      const dateString = new Date().toLocaleDateString()
      this.#db.insertRunningLog({ distance, dateString })
      console.log('Great run!')
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        process.exit()
      }
    } finally {
      this.#db.close()
    }
  }
}
