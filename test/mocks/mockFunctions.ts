import { program } from 'commander'
import { EveryRun } from '../../src/EveryRun.js'
import { EveryRunDB } from '../../src/EveryRunDB.js'
import { CliOptions, RunningLogParams } from '../../src/interfaces.js'

export const consoleLog = jest.spyOn(console, 'log')
export const exit = jest.spyOn(process, 'exit').mockImplementation()

export const cliOptions = (options: CliOptions) => {
  jest.spyOn(program, 'opts').mockImplementation(() => options)
}

export const clearDB = (db: EveryRunDB) => {
  db.deleteRecords('dailyDistance')
  db.deleteRecords('runningLog')
}

const isInvalidAnswer = (answer: string) => {
  return Number.isNaN(Number(answer)) || Number(answer) <= 0 || Number(answer) > 20
}

export const askDistance = (answer: string) => {
  jest.spyOn(EveryRun.prototype, 'askDistance')
    .mockImplementation(() => {
      return new Promise<number>((resolve, reject) => {
        if (isInvalidAnswer(answer)) reject(new Error(`${answer}は不正です。1〜20kmで設定してください。`))
        resolve(Number(answer))
      })
    })
}

export const setUpTables = (db: EveryRunDB, { distance, dateString }: RunningLogParams) => {
  db.deleteRecords('dailyDistance')
  db.deleteRecords('runningLog')
  db.insertDailyDistance(distance)
  db.insertRunningLog({ distance, dateString })
}
