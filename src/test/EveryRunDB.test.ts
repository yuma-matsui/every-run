import sqlite3 from 'sqlite3'
import { EveryRunDB } from '../EveryRunDB'
import { DailyDistance, RunningLog, RunningLogParams } from '../interfaces'

describe('EveryRunDBクラス', () => {
  const db = new EveryRunDB()
  let distance: number
  beforeEach(() => {
    distance = 5
  })

  afterAll(() => {
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

  describe('#getDailyGoal', () => {
    it('id = 1のレコードのdistanceカラムの値を返す', async () => {
      const dailyDistance = await db.getDailyGoal()
      const firstRecord = (await db.all<DailyDistance[]>('dailyDistance')).at(0)
      expect(dailyDistance).toBe(firstRecord?.distance)
    })

    it('updateDailyDistanceした場合その引数に与えた値を返す', async () => {
      distance = 15
      db.updateDailyDistance(distance)
      const dailyDistance = await db.getDailyGoal()
      expect(dailyDistance).toBe(distance)
    })
  })

  describe('#insertRunningLog', () => {
    let distance = 5
    let dateString = new Date().toLocaleDateString()
    const runningLogParams: RunningLogParams = { distance, dateString }
    it('引数にRunningLogParams型のオブジェクトを渡すとレコードが一件増える', async () => {
      console.log(runningLogParams)
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
      console.log(runningLogs)
      expect(runningLogs.every(runningLog => {
        return (typeof runningLog.id === 'number') &&
                (typeof runningLog.distance === 'number') &&
                (typeof runningLog.date === 'string')
      })).toEqual(true)
    })
  })
})
