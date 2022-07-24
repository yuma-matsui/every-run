import { EveryRun } from './EveryRun.js'
import { EveryRunDB } from './EveryRunDB.js'
import { EveryRunOption } from './EveryRunOption.js'

await EveryRun.start(new EveryRunOption().parameters, new EveryRunDB())
