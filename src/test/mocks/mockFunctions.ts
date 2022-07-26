import { program } from 'commander'
import { EveryRunDB } from '../../EveryRunDB.js'
import { CliOptions } from '../../interfaces.js'

export const consoleLog = jest.spyOn(console, 'log')
export const exit = jest.spyOn(process, 'exit').mockImplementation()

export const cliOptions = (options: CliOptions) => {
  jest.spyOn(program, 'opts').mockImplementation(() => options)
}

export const clearDB = (db: EveryRunDB) => {
  db.dropTable('dailyDistance')
  db.dropTable('runningLog')
  db.close()
}
