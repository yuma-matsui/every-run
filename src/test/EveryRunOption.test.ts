import { program } from 'commander'
import { EveryRunOption } from '../EveryRunOption'

describe('EveryRunOptionクラス', () => {
  it('初期化時にprogramオブジェクトが呼ばれる', () => {
    const mockCommanderOption = jest.spyOn(program, 'option')
    const mockCommanderParse = jest.spyOn(program, 'parse')
    const mockCommanderOpts = jest.spyOn(program, 'opts')
    const ero = new EveryRunOption()
    expect(mockCommanderOption).toHaveBeenCalled()
    expect(mockCommanderParse).toHaveBeenCalled()
    expect(mockCommanderOpts).toHaveBeenCalled()
  })
})
