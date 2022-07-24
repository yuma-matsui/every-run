import { NumUnionBool } from '../interfaces.js'
import { YearAndMonth } from '../YearAndMonth'
import * as Mock from './mocks/mockFunctions'

describe('YearAndMonthクラス', () => {
  const mockGetMonth = jest.spyOn(YearAndMonth.prototype, 'month', 'get')
  const mockGetYear = jest.spyOn(YearAndMonth.prototype, 'year', 'get')
  let year: NumUnionBool
  let month: NumUnionBool

  describe('get propertyのテスト', () => {
    it('get yearとget monthが呼ばれる', () => {
      year = 2000
      month = 1
      expect(new YearAndMonth(year, month).property)
      expect(mockGetMonth).toHaveBeenCalled()
      expect(mockGetYear).toHaveBeenCalled()
    })

    describe('monthの値が不正な場合', () => {
      year = 2022
      it.each([
        [13],
        [20],
        [30]
      ])('引数monthが%iの場合エラーを出力する', month => {
        expect(new YearAndMonth(year, month).property)
        expect(Mock.consoleLog).toHaveBeenCalledWith(`${month}は不正です。1〜12の範囲で指定してください。`)
        expect(Mock.exit).toHaveBeenCalled()
      })
    })

    describe('引数yearの値が不正な場合', () => {
      month = 12
      it.each([
        [3001],
        [5000],
        [10000]
      ])('yearが%iの場合エラーを出力する', year => {
        expect(new YearAndMonth(year, month).property)
        expect(Mock.consoleLog).toHaveBeenCalledWith(`${year}は不正な値です。3000以内で指定してください。`)
        expect(Mock.exit).toHaveBeenCalled()
      })
    })

    describe('引数monthの値が正常な場合', () => {
      const year = 2000
      it('falseの場合今日の月を返す', () => {
        month = false
        expect(new YearAndMonth(year, month).property.month).toBe((new Date().getMonth()) + 1)
      })

      it.each([
        [1],
        [6],
        [12]
      ])('%iを指定した場合$iを返す', month => {
        expect(new YearAndMonth(year, month).property.month).toBe(month)
      })
    })

    describe('引数yearの値が正常な場合', () => {
      const month = 12
      it('falseの場合今日の年を返す', () => {
        year = false
        expect(new YearAndMonth(year, month).property.year).toBe(new Date().getFullYear())
      })

      it.each([
        [1000],
        [2000],
        [2022],
        [3000]
      ])('%iを指定した場合$iを返す', year => {
        expect(new YearAndMonth(year, month).property.year).toBe(year)
      })
    })
  })
})
