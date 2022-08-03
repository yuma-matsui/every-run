import { EveryRun } from '../src/EveryRun'
import { EveryRunDB } from '../src/EveryRunDB'
import { EveryRunOptions } from '../src/types'
import * as Mock from '../test/mocks/mockFunctions'

describe('EveryRunクラスのテスト', () => {
  let options: EveryRunOptions
  let db: EveryRunDB
  beforeEach(() => {
    options = {
      t: false,
      y: false,
      m: false,
      e: false,
      u: false
    }
    db = new EveryRunDB()
  })

  afterAll(() => {
    Mock.clearDB(new EveryRunDB())
  })

  describe('static startのテスト', () => {
    describe('初めて実行する場合はどんな場合も目標距離の設定になる', () => {
      beforeEach(() => {
        Mock.clearDB(db)
      })

      describe('ユーザの入力が正しい場合', () => {
        it.each([
          [options, '5'],
          [{ t: true, y: false, m: false, e: false, u: false }, '1'],
          [{ t: false, y: 2022, m: 10, e: false, u: false }, '20']
        ])('引数がなしまたは1つ以上指定されている場合', async (options, answer) => {
          Mock.askDistance(answer)
          await EveryRun.start(options, db)
          expect(Mock.consoleLog).toBeCalledWith(`1日の目標距離を${answer}kmに設定しました。`)
        })
      })

      describe('ユーザの入力が不正な場合', () => {
        it.each([
          { options, answer: 'hello' },
          { options, answer: '0' },
          { options, answer: '21' }
        ])('$answerが入力された場合', async ({ options, answer }) => {
          Mock.askDistance(answer)
          await EveryRun.start(options, db)
          expect(Mock.consoleLog).toHaveBeenCalledWith(`${answer}は不正です。1〜20kmで設定してください。`)
          expect(Mock.exit).toHaveBeenCalled()
        })
      })
    })

    describe('2回目以降の実行の場合', () => {
      let distance: number
      let dateString: string
      beforeEach(() => {
        distance = 5
        dateString = new Date().toLocaleDateString()
        Mock.setUpTables(db, { distance, dateString })
      })

      it('引数が指定されなかった場合', async () => {
        await EveryRun.start(options, db)
        expect(Mock.consoleLog).toHaveBeenCalledWith('Great run!')
      })

      it('-tが指定された場合', async () => {
        options.t = true
        await EveryRun.start(options, db)
        expect(Mock.consoleLog).toHaveBeenCalledWith(`これまでの全走行距離は${distance}kmです。`)
      })

      describe('-y, -mが指定された場合', () => {
        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1

        it('-yが指定された場合', async () => {
          options.y = year
          await EveryRun.start(options, db)
          expect(Mock.consoleLog).toHaveBeenCalledWith(`${options.y}年の合計走行距離は${distance}kmです。`)
        })

        it('-mが指定された場合', async () => {
          options.m = month
          await EveryRun.start(options, db)
          expect(Mock.consoleLog).toHaveBeenCalledWith(`${new Date().getFullYear()}年${options.m}月の合計走行距離は${distance}kmです。`)
        })

        it('-yと-mが同時に指定された場合', async () => {
          options.y = year
          options.m = month
          await EveryRun.start(options, db)
          expect(Mock.consoleLog).toHaveBeenCalledWith(`${options.y}年${options.m}月の合計走行距離は${distance}kmです。`)
        })

        it.each([
          [
            { t: false, y: 2000, m: false, e: false, u: false },
            '2000年の合計走行距離は0kmです。'
          ],
          [
            { t: false, y: false, m: month - 1, e: false, u: false },
            `${year}年${month - 1}月の合計走行距離は0kmです。`
          ],
          [
            { t: false, y: 2000, m: month - 1, e: false, u: false },
            `2000年${month - 1}月の合計走行距離は0kmです。`
          ]
        ])('指定された年月のレコードがない場合', async (options, expected) => {
          await EveryRun.start(options, db)
          expect(Mock.consoleLog).toHaveBeenCalledWith(expected)
        })
      })

      describe('-eが指定された場合', () => {
        it('指定された値がDailyDistanceテーブルのdistanceよりも大きい場合', async () => {
          options.e = 10
          await EveryRun.start(options, db)
          const extraDistance = options.e - distance
          expect(Mock.consoleLog).toHaveBeenCalledWith(`Fantastic!! 目標より${extraDistance}km多く走りました!`)
        })

        it.each([
          [3],
          [5]
        ])('指定された値がDailyDistanceテーブルのdistance以下の場合', async eOption => {
          options.e = eOption
          await EveryRun.start(options, db)
          expect(Mock.consoleLog).toHaveBeenCalledWith(`${options.e}kmは1日の目標距離${distance}kmより短いです。`)
          expect(Mock.exit).toHaveBeenCalled()
        })
      })

      describe('-uが指定された場合', () => {
        it.each([
          [1],
          [10],
          [20]
        ])('引数が1〜20の場合', async uOption => {
          options.u = uOption
          await EveryRun.start(options, db)
          expect(Mock.consoleLog).toHaveBeenCalledWith(`1日の目標距離を${options.u}kmに変更しました。`)
        })

        it.each([
          [21],
          [30]
        ])('引数が20より大きい場合', async uOption => {
          options.u = uOption
          await EveryRun.start(options, db)
          expect(Mock.consoleLog).toHaveBeenCalledWith('毎日20km以上走るのは故障のリスクがあります。20km以下に設定しましょう。')
          expect(Mock.exit).toHaveBeenCalled()
        })
      })
    })
  })
})
