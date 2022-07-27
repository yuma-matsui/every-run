import sqlite3 from 'sqlite3'
import { EveryRunDB } from '../src/EveryRunDB'
import { DailyDistance, RunningLog, RunningLogParams } from '../src/interfaces'
import { clearDB, setUpTables } from './mocks/mockFunctions'

describe('EveryRunDBクラス', () => {
  let db: EveryRunDB
  let distance: number
  let dateString: string

  beforeEach(() => {
    db = new EveryRunDB()
    distance = 5
    dateString = new Date().toLocaleDateString()
    setUpTables(db, { distance, dateString })
  })

  afterEach(() => {
    clearDB(db)
    db.close()
  })

  describe('コンストラクタ', () => {
    it('newするとverboseがよばれる', () => {
      const mockVerbose = jest.spyOn(sqlite3, 'verbose')
      expect(new EveryRunDB())
      expect(mockVerbose).toHaveBeenCalled()
    })
  })

  describe('#insertDailyDistance', () => {
    it('DailyDistanceテーブルのレコードが一件増える', async () => {
      const beforeRecordLength = (await db.all<DailyDistance[]>('dailyDistance')).length
      db.insertDailyDistance(distance)
      const afterRecordLength = (await db.all<DailyDistance[]>('dailyDistance')).length
      expect(afterRecordLength - beforeRecordLength).toBe(1)
    })

    it('引数に与えた数値をdistanceカラムの数値としてレコードを作成する', async () => {
      db.insertDailyDistance(distance)
      const newRecord = (await db.all<DailyDistance[]>('dailyDistance')).at(-1)
      expect(newRecord?.distance).toBe(distance)
    })
  })

  describe('#updateDailyDistance', () => {
    it('メソッド実行後もレコード数は変わらない', async () => {
      const beforeRecordLength = (await db.all<DailyDistance[]>('dailyDistance')).length
      db.updateDailyDistance(distance)
      const afterRecordLength = (await db.all<DailyDistance[]>('dailyDistance')).length
      expect(afterRecordLength - beforeRecordLength).toBe(0)
    })

    it('引数に与えた数値をdistanceカラムの数値としてレコードを更新する', async () => {
      distance = 10
      db.updateDailyDistance(distance)
      const updatedRecord = (await db.all<DailyDistance[]>('dailyDistance')).at(-1)
      expect(updatedRecord?.distance).toBe(distance)
    })
  })

  describe('#insertRunningLog', () => {
    let distance = 5
    const runningLogParams: RunningLogParams = { distance, dateString }
    it('引数にRunningLogParams型のオブジェクトを渡すとレコードが一件増える', async () => {
      const beforeRecordLength = (await db.all<RunningLog[]>('runningLog')).length
      db.insertRunningLog(runningLogParams)
      const afterRecordLength = (await db.all<RunningLog[]>('runningLog')).length
      expect(afterRecordLength - beforeRecordLength).toBe(1)
    })

    it('引数に渡したオブジェクトのdistance, dateStringプロパティの値でレコードが作成される', async () => {
      distance = 20
      dateString = '2022/7/25'
      runningLogParams.distance = distance
      runningLogParams.dateString = dateString
      db.insertRunningLog(runningLogParams)

      const newRecord = (await db.all<RunningLog[]>('runningLog')).at(-1)
      expect(newRecord?.distance).toBe(distance)
      expect(newRecord?.date).toBe(dateString)
    })
  })

  describe('#all', () => {
    it('引数にdailyDistanceを与えた場合DailyDistance型の配列を返す', async () => {
      const dailyDistances = await db.all<DailyDistance[]>('dailyDistance')
      expect(dailyDistances.every(dailyDistance => {
        return (typeof dailyDistance.distance === 'number') &&
                (typeof dailyDistance.id === 'number')
      })).toEqual(true)
    })

    it('引数にrunningLogを与えた場合RunningLog型の配列を返す', async () => {
      const runningLogs = await db.all<RunningLog[]>('runningLog')
      expect(runningLogs.every(runningLog => {
        return (typeof runningLog.id === 'number') &&
                (typeof runningLog.distance === 'number') &&
                (typeof runningLog.date === 'string')
      })).toEqual(true)
    })
  })

  describe('deleteRecords', () => {
    it('引数にdailyDistanceを与えた場合DailyDistanceテーブルの全レコードを削除する', async () => {
      db.deleteRecords('dailyDistance')
      const dailyDistanceSize = (await db.all<DailyDistance[]>('dailyDistance')).length
      expect(dailyDistanceSize).toBe(0)
    })

    it('引数にrunningLogを与えた場合RunningLogテーブルの全レコードを削除する', async () => {
      db.deleteRecords('runningLog')
      const runningLogSize = (await db.all<RunningLog[]>('runningLog')).length
      expect(runningLogSize).toBe(0)
    })
  })
})
