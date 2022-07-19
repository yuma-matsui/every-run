import { Runner } from '../Runner'

describe('Runnerクラス', () => {
  let distance: number
  it('初期化時に受け取った数値を返すget Distanceを持つ', () => {
    distance = 10
    const runner = new Runner(distance)
    const getTD = jest.spyOn(runner, 'targetDistance', 'get')
    runner.targetDistance
    expect(getTD).toHaveBeenCalledTimes(1)
    expect(getTD).toReturnWith(distance)
  })
})
