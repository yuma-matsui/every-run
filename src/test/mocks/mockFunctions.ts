export const consoleLog = jest.spyOn(console, 'log')
export const exit = jest.spyOn(process, 'exit').mockImplementation()
