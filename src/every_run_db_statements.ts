export const createDailyDistanceTable = 'CREATE TABLE if not exists DailyDistance (id INTEGER PRIMARY KEY AUTOINCREMENT, distance INTEGER)'

export const createRunningLogTable = 'CREATE TABLE if not exists RunningLog (id INTEGER PRIMARY KEY AUTOINCREMENT, distance INTEGER, date TEXT)'

export const insertDailyDistance = 'INSERT INTO DailyDistance (distance) VALUES (?)'

export const insertRunningLog = 'INSERT INTO RunningLog (distance, date) VALUES (?, ?)'

export const selectAllFromDailyDistance = 'SELECT * FROM DailyDistance'

export const selectDistanceFromDailyDistance = 'SELECT distance FROM DailyDistance WHERE id = 1'

export const selectAllFromRunningLog = 'SELECT * FROM RunningLog'

export const updateDailyDistance = 'UPDATE DailyDistance SET distance = ?'

export const dropDailyDistanceTable = 'DROP TABLE DailyDistance'

export const dropRunningLogTable = 'DROP TABLE RunningLog'

export const deleteFromDailyDistance = 'DELETE FROM DailyDistance'

export const deleteFromRunningLog = 'DELETE FROM RunningLog'
