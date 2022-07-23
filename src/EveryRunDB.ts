import sqlite3, { type RunResult } from 'sqlite3'
import * as SqlStatement from './every_run_db_statements.js'
export class EveryRunDB {
  static storage = './every_run.db'

  #db: sqlite3.Database
  constructor () {
    sqlite3.verbose()
    this.#db = new sqlite3.Database(EveryRunDB.storage)
    this.#createTable(SqlStatement.createRunnerTable)
    this.#createTable(SqlStatement.createRunningLogTable)
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
      const statement = this.#db.prepare(SqlStatement.insertRunner)
      statement.run(distance)
      statement.finalize()
    }
    this.#serialize(method)
  }

  updateRunner (distance: number) {
    const method = () => {
      const statement = this.#db.prepare(SqlStatement.updateRunner)
      statement.run(distance)
      statement.finalize()
    }
    this.#serialize(method)
  }

  getDailyGoal () {
    return new Promise<number>(resolve => {
      const method = () => {
        this.#db.get(SqlStatement.selectDistanceFromRunner, (error: Error, { distance }: { distance: number }) => {
          if (error) throw error
          resolve(distance)
        })
      }
      this.#serialize(method)
    })
  }

  all (table: 'runner' | 'runningLog') {
    return new Promise<RunResult[]>(resolve => {
      const sqlStatement = this.#runnerOrRunningLog(table)
      const method = () => {
        this.#db.all(sqlStatement, (error: Error, rows: RunResult[]) => {
          if (error) throw error
          resolve(rows)
        })
      }
      this.#serialize(method)
    })
  }

  #runnerOrRunningLog (table: 'runner' | 'runningLog') {
    let sqlStatement: string
    if (table === 'runner') {
      sqlStatement = SqlStatement.selectAllFromRunner
    } else {
      sqlStatement = SqlStatement.selectAllFromRunningLog
    }
    return sqlStatement
  }

  insertRunningLog ({ distance, dateString }: { distance: number, dateString: string }) {
    const method = () => {
      const statement = this.#db.prepare(SqlStatement.insertRunningLog)
      statement.run(distance, dateString)
      statement.finalize()
    }
    this.#serialize(method)
  }
}
