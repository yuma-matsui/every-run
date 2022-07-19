import { EveryRun } from '../EveryRun'
import { Runner } from '../Runner'
import * as Mock from '../test/mocks/mockFunctions'

describe('EveryRunクラスのテスト', () => {
  describe('static startのテスト', () => {
    describe('rl#questionに不正な値を渡した場合', () => {
      it.each([
        ['a'],
        ['0'],
        ['21']
      ])('%sを入力した場合', async (input: string) => {
        const errMessage = `${input} is invalid. Please input a number\n greater than 0 \n or less equal than 20.`
        Mock.askDistance(input)
        await EveryRun.start()
        expect(Mock.consoleLog).toHaveBeenCalledWith(errMessage)
        expect(Mock.exit).toHaveBeenCalled()
      })
    })

    describe('rl#questionに有効な値を渡した場合', () => {
      it.each([
        ['1'],
        ['10'],
        ['20']
      ])('%sを入力した場合', async (input: string) => {
        const message = `Good Luck! You set the ${input} as your goal.`
        Mock.askDistance(input)
        await EveryRun.start()
        expect(Mock.consoleLog).toBeCalledWith(message)
      })

      it('Runnerオブジェクトが作成されてget targetDistanceが呼ばれる', async () => {
        Mock.askDistance('10')
        const getTD = jest.spyOn(Runner.prototype, 'targetDistance', 'get')
        await EveryRun.start()
        expect(getTD).toHaveBeenCalled()
        expect(getTD).toReturnWith(10)
      })
    })
  })
})
