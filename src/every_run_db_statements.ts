export const createRunnerTable = 'CREATE TABLE if not exists Runner (id INTEGER PRIMARY KEY AUTOINCREMENT, distance INTEGER)'
export const createRunningLogTable = 'CREATE TABLE if not exists RunningLog (id INTEGER PRIMARY KEY AUTOINCREMENT, distance INTEGER, date TEXT)'
export const insertRunner = 'INSERT INTO Runner (distance) VALUES (?)'
export const insertRunningLog = 'INSERT INTO RunningLog (distance, date) VALUES (?, ?)'
export const selectAllFromRunner = 'SELECT * FROM Runner'
export const selectDistanceFromRunner = 'SELECT distance FROM Runner WHERE id = 1'
export const selectAllFromRunningLog = 'SELECT * FROM RunningLog'