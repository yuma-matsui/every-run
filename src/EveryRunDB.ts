import sqlite3 from 'sqlite3'
import * as SqlStatement from './every_run_db_statements.js'
import { RunningLogParams, dailyDistanceOrRunningLog } from './interfaces.js'
export class EveryRunDB {
  static storage = './every_run.db'

  #db: sqlite3.Database
  constructor () {
    sqlite3.verbose()
    this.#db = new sqlite3.Database(EveryRunDB.storage)
    this.#createTable(SqlStatement.createDailyDistanceTable)
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

  insertDailyDistance (distance: number) {
    const method = () => {
      const statement = this.#db.prepare(SqlStatement.insertDailyDistance)
      statement.run(distance)
      statement.finalize()
    }
    this.#serialize(method)
  }

  updateDailyDistance (distance: number) {
    const method = () => {
      const statement = this.#db.prepare(SqlStatement.updateDailyDistance)
      statement.run(distance)
      statement.finalize()
    }
    this.#serialize(method)
  }

  getDailyGoal () {
    return new Promise<number>(resolve => {
      const method = () => {
        this.#db.get(SqlStatement.selectDistanceFromDailyDistance, (error: Error, { distance }: { distance: number }) => {
          if (error) throw error
          resolve(distance)
        })
      }
      this.#serialize(method)
    })
  }

  all<T>(table: dailyDistanceOrRunningLog) {
    return new Promise<T>(resolve => {
      const sqlStatement = this.#getSelectAllStatement(table)
      const method = () => {
        this.#db.all(sqlStatement, (error: Error, rows: T) => {
          if (error) throw error
          resolve(rows)
        })
      }
      this.#serialize(method)
    })
  }

  #getSelectAllStatement (table: dailyDistanceOrRunningLog) {
    let sqlStatement: string
    if (table === 'dailyDistance') {
      sqlStatement = SqlStatement.selectAllFromDailyDistance
    } else {
      sqlStatement = SqlStatement.selectAllFromRunningLog
    }
    return sqlStatement
  }

  insertRunningLog ({ distance, dateString }: RunningLogParams) {
    const method = () => {
      const statement = this.#db.prepare(SqlStatement.insertRunningLog)
      statement.run(distance, dateString)
      statement.finalize()
    }
    this.#serialize(method)
  }

  deleteRecords (table: dailyDistanceOrRunningLog) {
    const sqlStatement = this.#getDeleteStatement(table)
    const method = () => {
      this.#db.run(sqlStatement)
    }
    this.#db.serialize(method)
  }

  #getDeleteStatement (table: dailyDistanceOrRunningLog) {
    let sqlStatement: string
    if (table === 'dailyDistance') {
      sqlStatement = SqlStatement.deleteFromDailyDistance
    } else {
      sqlStatement = SqlStatement.deleteFromRunningLog
    }
    return sqlStatement
  }

  dropTable (table: dailyDistanceOrRunningLog) {
    const statement = this.#getDropStatement(table)
    const method = () => {
      this.#db.run(statement)
    }
    this.#serialize(method)
  }

  #getDropStatement (table: dailyDistanceOrRunningLog) {
    let sqlStatement: string
    if (table === 'dailyDistance') {
      sqlStatement = SqlStatement.dropDailyDistanceTable
    } else {
      sqlStatement = SqlStatement.dropRunningLogTable
    }
    return sqlStatement
  }
}
