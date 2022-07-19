import { EveryRun } from '../../EveryRun.js'

export const consoleLog = jest.spyOn(console, 'log')
export const exit = jest.spyOn(process, 'exit').mockImplementation()

const getErrMessage = (input: string) => {
  return `${input} is invalid. Please input a number\n greater than 0 \n or less equal than 20.`
}

const isInvalidInput = (input: string) => {
  const inputNum = Number(input)
  return Number.isNaN(inputNum) || inputNum <= 0 || inputNum > 20
}

export const askDistance = (input: string) => {
  jest.spyOn(EveryRun, 'askDistance').mockImplementation(() => {
    return new Promise<number>((resolve, reject) => {
      if (isInvalidInput(input)) reject(new Error(getErrMessage(input)))
      resolve(Number(input))
    })
  })
}
