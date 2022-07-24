import * as readline from 'readline'
import { stdin as input, stdout as output } from 'process'
import { EveryRunOptions, RunningLog } from './interfaces/CliOptions.js'
import { EveryRunDB } from './EveryRunDB.js'
import { RunResult } from 'sqlite3'
import { YearAndMonth } from './YearAndMonth.js'

export class EveryRun {
  static async start (options: EveryRunOptions, db: EveryRunDB) {
    const er = new EveryRun(options, db)
    await er.#start()
  }

  readonly #options: EveryRunOptions
  readonly #db: EveryRunDB
  constructor (options: EveryRunOptions, db: EveryRunDB) {
    this.#options = options
    this.#db = db
  }

  async #start () {
    try {
      if (!(await this.#existRecord())) {
        await this.#createRecord()
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

  async #existRecord () {
    const records = await this.#db.all<RunResult[]>('runner')
    return records.length === 1
  }

  async #createRecord () {
    try {
      const distance = await this.#askDistance()
      this.#db.insertDailyDistance(distance)
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
      rl.question('1日何km走りますか?\n', answer => {
        if (this.#isInvalidAnswer(answer)) reject(new Error(`${answer}は不正です。1〜20kmで設定してください。`))
        resolve(Number(answer))
        rl.close()
      })
    })
  }

  #isInvalidAnswer (answer: string) {
    return Number.isNaN(Number(answer)) || Number(answer) <= 0 || Number(answer) > 20
  }

  async #runOption () {
    if (this.#options.t) {
      await this.#printTotalRunningLog()
    } else if (this.#options.y || this.#options.m) {
      await this.#printSpecificPeriodLog()
    } else if (this.#options.e) {
      await this.#insertExtraRunningLog()
    } else if (this.#options.u) {
      this.#updateDailyDistance()
    } else {
      await this.#insertDailyLog()
    }
  }

  async #printTotalRunningLog () {
    try {
      const allRunningLog = await this.#db.all<RunningLog[]>('runningLog')
      const totalDistance = this.#totalRunningDistance(allRunningLog)
      console.log(`これまでの全走行距離は${totalDistance}kmです。`)
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        process.exit()
      }
    } finally {
      this.#db.close()
    }
  }

  #totalRunningDistance (runningLog: RunningLog[]) {
    let totalDistance = 0
    for (const { distance } of runningLog) {
      totalDistance += distance
    }
    return totalDistance
  }

  async #printSpecificPeriodLog () {
    try {
      const totalDistance = await this.#getSpecificPeriodTotalDistance()
      console.log(this.#specificPeriodString(totalDistance))
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        process.exit()
      }
    } finally {
      this.#db.close()
    }
  }

  #specificPeriodString (totalDistance: number) {
    let str: string

    if (this.#onlyYear()) {
      str = `${this.#yOptionParameter()}年の合計走行距離は${totalDistance}kmです。`
    } else if (typeof this.#options.y === 'boolean') {
      str = `${new Date().getFullYear()}年${this.#mOptionParameter()}月の合計走行距離は${totalDistance}kmです。`
    } else {
      str = `${this.#yOptionParameter()}年${this.#mOptionParameter()}月の合計走行距離は${totalDistance}kmです。`
    }
    return str
  }

  #yOptionParameter () {
    if (typeof this.#options.y === 'boolean') process.exit()
    return this.#options.y
  }

  #mOptionParameter () {
    if (typeof this.#options.m === 'boolean') process.exit()
    return this.#options.m
  }

  async #getSpecificPeriodTotalDistance () {
    const allRunningLog = await this.#db.all<RunningLog[]>('runningLog')
    const targetPeriodLog = allRunningLog.filter(({ date }: RunningLog) => {
      return this.#targetPeriodFilter().test(date)
    })
    return this.#totalRunningDistance(targetPeriodLog)
  }

  #onlyYear () {
    return (typeof this.#options.y === 'number') && (typeof this.#options.m === 'boolean')
  }

  #targetPeriodFilter () {
    let targetPeriodFilter: RegExp
    const { year, month } = new YearAndMonth(this.#options.y, this.#options.m).property

    if (this.#onlyYear()) {
      targetPeriodFilter = new RegExp(String.raw`^${year}\/`)
    } else {
      targetPeriodFilter = new RegExp(String.raw`^${year}\/${month}\/`)
    }
    return targetPeriodFilter
  }

  async #insertExtraRunningLog () {
    try {
      const distance = this.#eOptionParameter()
      const dateString = new Date().toLocaleDateString()
      this.#db.insertRunningLog({ distance, dateString })
      console.log(`Fantastic!! 目標より${await this.#extraDistance()}km多く走りました!`)
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        process.exit()
      }
    } finally {
      this.#db.close()
    }
  }

  #eOptionParameter () {
    if (typeof this.#options.e === 'boolean') process.exit()
    return this.#options.e
  }

  async #extraDistance () {
    return this.#eOptionParameter() - (await this.#db.getDailyGoal())
  }

  #updateDailyDistance () {
    try {
      const distance = this.#uOptionParameter()
      this.#db.updateDailyDistance(distance)
      console.log(`1日の目標距離を${distance}kmに変更しました。`)
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        process.exit()
      }
    } finally {
      this.#db.close()
    }
  }

  #uOptionParameter () {
    if (typeof this.#options.u === 'boolean') process.exit()
    if (this.#options.u > 20) {
      console.log('毎日20km以上走るのは故障のリスクがあります。20km以下に設定しましょう。')
      process.exit()
    }
    return this.#options.u
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
