import { EveryRun } from '../EveryRun'
import { EveryRunDB } from '../EveryRunDB'
import { EveryRunOptions } from '../interfaces/CliOptions'
import * as Mock from '../test/mocks/mockFunctions'
jest.mock('../Runner')

describe('EveryRunクラスのテスト', () => {
  describe('static startのテスト', () => {
    const db = new EveryRunDB()
    let erOptions: EveryRunOptions = {
      t: false,
      y: false,
      m: false,
      e: false,
      u: false
    }
    describe('オプションなしの場合', () => {
      beforeEach(async () => {
        await EveryRun.start(erOptions, db)
      })

      it('すでにレコードが存在する場合', () => {
        expect(Mock.consoleLog).toHaveBeenCalledWith("Congratulation! You've reached your daily goal.")
      })
    })

    describe('オプションありの場合', () => {
      beforeEach(() => {
        erOptions = {
          t: false,
          y: false,
          m: false,
          e: false,
          u: false
        }
      })

      it('-tが指定された場合', async () => {
        erOptions.t = true
        await EveryRun.start(erOptions, db)
        expect(Mock.consoleLog).toHaveBeenCalledWith('Show your total running log.')
      })

      it('-yオプションが指定された場合', async () => {
        erOptions.y = 2000
        await EveryRun.start(erOptions, db)
        expect(Mock.consoleLog).toHaveBeenCalledTimes(2)
        expect(Mock.consoleLog).toHaveBeenCalledWith('Show your yearly total running log')
        expect(Mock.consoleLog).toHaveBeenCalledWith('Show your monthly total running log')
      })

      it('-mオプションが指定された場合', async () => {
        erOptions.m = 11
        await EveryRun.start(erOptions, db)
        expect(Mock.consoleLog).toHaveBeenCalledTimes(2)
        expect(Mock.consoleLog).toHaveBeenCalledWith('Show your yearly total running log')
        expect(Mock.consoleLog).toHaveBeenCalledWith('Show your monthly total running log')
      })

      it('-m, -yオプションが同時に指定された場合', async () => {
        erOptions.y = 2000
        erOptions.m = 11
        await EveryRun.start(erOptions, db)
        expect(Mock.consoleLog).toHaveBeenCalledTimes(2)
        expect(Mock.consoleLog).toHaveBeenCalledWith('Show your yearly total running log')
        expect(Mock.consoleLog).toHaveBeenCalledWith('Show your monthly total running log')
      })

      it('-eオプションが指定された場合', async () => {
        erOptions.e = 10
        await EveryRun.start(erOptions, db)
        expect(Mock.consoleLog).toHaveBeenCalledWith(`Fantastic!! You've reached ${erOptions.e} km.`)
      })

      it('-uオプションが指定された場合', async () => {
        erOptions.u = 8
        await EveryRun.start(erOptions, db)
        expect(Mock.consoleLog).toHaveBeenCalledWith('How many kilometer do you run a day?')
      })
    })
  })
})
