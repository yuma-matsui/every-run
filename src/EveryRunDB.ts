import sqlite3, { type RunResult } from 'sqlite3'
export class EveryRunDB {
  static storage = './every_run.db'
  static createRunnerTableStatement = 'CREATE TABLE if not exists Runner (id INTEGER PRIMARY KEY AUTOINCREMENT, distance INTEGER)'
  static createRunningLogTableStatement = 'CREATE TABLE if not exists RunningLog (id INTEGER PRIMARY KEY AUTOINCREMENT, distance INTEGER, date TEXT)'
  static insertRunnerStatement = 'INSERT INTO Runner (distance) VALUES (?)'
  static selectAllFromRunnerStatement = 'SELECT * FROM Runner'

  #db: sqlite3.Database
  constructor () {
    sqlite3.verbose()
    this.#db = new sqlite3.Database(EveryRunDB.storage)
    this.#createTable(EveryRunDB.createRunnerTableStatement)
    this.#createTable(EveryRunDB.createRunningLogTableStatement)
  }

  close () {
    this.#db.close()
  }

  #createTable (createTableStatement: string) {
    const method = () => {
      this.#db.run(createTableStatement)
    }
    this.#serialize(method)
  }

  #serialize (method: (callback?: (() => void) | undefined) => void) {
    this.#db.serialize(() => {
      method()
    })
  }

  insertRunner (distance: number) {
    const method = () => {
      const statement = this.#db.prepare(EveryRunDB.insertRunnerStatement)
      statement.run(distance)
      statement.finalize()
    }
    this.#serialize(method)
  }

  all () {
    return new Promise<RunResult[]>(resolve => {
      const method = () => {
        this.#db.all(EveryRunDB.selectAllFromRunnerStatement, (error: Error, runners: RunResult[]) => {
          if (error) throw error
          resolve(runners)
        })
      }
      this.#serialize(method)
    })
  }
}
