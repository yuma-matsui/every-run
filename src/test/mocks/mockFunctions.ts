import { program } from 'commander'
import { CliOptions } from '../../interfaces.js'

export const consoleLog = jest.spyOn(console, 'log')
export const exit = jest.spyOn(process, 'exit').mockImplementation()

export const cliOptions = (options: CliOptions) => {
  jest.spyOn(program, 'opts').mockImplementation(() => options)
}
