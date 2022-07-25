import { program } from 'commander'
import { EveryRunOption } from '../EveryRunOption'
import { CliOptions, EveryRunOptions } from '../interfaces.js'
import * as Mock from '../test/mocks/mockFunctions'

describe('EveryRunOptionクラス', () => {
  describe('constructor', () => {
    it('初期化時にprogramオブジェクトが呼ばれる', () => {
      const mockCommanderOption = jest.spyOn(program, 'option')
      const mockCommanderParse = jest.spyOn(program, 'parse')
      const mockCommanderOpts = jest.spyOn(program, 'opts')
      expect(new EveryRunOption())
      expect(mockCommanderOption).toHaveBeenCalled()
      expect(mockCommanderParse).toHaveBeenCalled()
      expect(mockCommanderOpts).toHaveBeenCalled()
    })

    describe('コマンドライン引数のチェック', () => {
      const checkOptions = (options: CliOptions, message: string) => {
        Mock.cliOptions(options)
        expect(new EveryRunOption())
        expect(Mock.consoleLog).toHaveBeenCalledWith(message)
      }
      describe('コマンド引数の数が不正な場合', () => {
        it.each([
          [5, { t: true, y: '2000', m: '12', e: '5', u: '10' }],
          [4, { t: true, y: '2000', m: '12', e: '5' }],
          [3, { t: true, y: '2000', m: '12' }]
        ])('引数が%i個の場合', (_, options) => {
          checkOptions(options, 'オプションの指定が不正です。')
        })

        it.each([
          [{ t: true, y: '2000' }],
          [{ e: '5', y: '2000' }],
          [{ u: '5', y: '2000' }],
          [{ t: true, m: '10' }],
          [{ e: '5', m: '10' }],
          [{ u: '5', m: '10' }],
          [{ t: true, e: '5' }],
          [{ t: true, u: '5' }],
          [{ u: '5', e: '5' }]
        ])('引数が2つ且つ-yと-mの組み合わせ以外の時', options => {
          checkOptions(options, 'オプションの指定が不正です。')
        })

        it.each([
          [{ y: '0' }],
          [{ m: '0' }],
          [{ u: '0' }],
          [{ e: '0' }]
        ])('オプション引数が0の場合', options => {
          checkOptions(options, '引数が不正です。0より大きい数値を指定してください。')
        })

        it.each([
          [{ y: 'invalid' }],
          [{ m: 'invalid' }],
          [{ u: 'invalid' }],
          [{ e: 'invalid' }]
        ])('オプション引数が文字の場合', options => {
          checkOptions(options, '引数が不正です。0より大きい数値を指定してください。')
        })
      })

      describe('コマンド引数が正しい場合', () => {
        it('tが指定された場合', () => {
          const t = true
          Mock.cliOptions({ t })
          expect(new EveryRunOption().parameters.t).toBe(t)
        })

        it('m, yが同時に指定された場合', () => {
          const y = '2000'
          const m = '10'
          Mock.cliOptions({ y, m })
          const ero = new EveryRunOption()
          expect(ero.parameters.y).toBe(Number(y))
          expect(ero.parameters.m).toBe(Number(m))
        })

        describe('t以外のオプションが1つ指定された場合', () => {
          type EROKeys = keyof EveryRunOptions
          const testTable: Array<[EROKeys, CliOptions, number]> = [
            ['y', { y: '2000' }, 2000],
            ['m', { m: '10' }, 10],
            ['u', { u: '5' }, 5],
            ['e', { e: '10' }, 10]
          ]

          it.each(testTable)('%sが指定された場合', (key, options, expected) => {
            Mock.cliOptions(options)
            expect(new EveryRunOption().parameters[key]).toBe(expected)
          })
        })

        it('引数の指定がなかった場合', () => {
          Mock.cliOptions({})
          const ero = new EveryRunOption()
          const eroKeys: Array<keyof EveryRunOptions> = [
            't', 'y', 'm', 'e', 'u'
          ]
          for (const key of eroKeys) {
            expect(ero.parameters[key]).toEqual(false)
          }
        })
      })
    })
  })
})
