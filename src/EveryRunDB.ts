import sqlite3 from 'sqlite3'
export class EveryRunDB {
  static storage = './every_run.db'
  static createRunnerTableStatement = 'CREATE TABLE if not exists Runner (id INTEGER PRIMARY KEY AUTOINCREMENT, distance INTEGER)'
  static createRunningLogTableStatement = 'CREATE TABLE if not exists RunningLog (id INTEGER PRIMARY KEY AUTOINCREMENT, distance INTEGER, date TEXT)'

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
}
