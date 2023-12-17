import { fork } from 'child_process'
import { getSetKey } from '../actions/apiKeys.js'
import { whichDir, upsertDir, rmDir } from '../actions/directories.js'
import display from '../actions/display.js'
import search from './search.js'

const username = process.argv[2].replace(/\s/g, '') || false
const { term, txt } = display

if (!username) {
  term.reset()
  txt.center('username cannot be empty')
  process.exit(0)
}

const getEnv = async () => {
  const apiKey = await getSetKey()

  // if !existssync mkdirsync
  const destination = await whichDir({ username })
  upsertDir(destination)

  try {
    const data = await search(username, apiKey)
    return {
      data,
      destination,
      username
    }
  } catch (e) {
    rmDir(destination)

    // if (e && typeof e === 'string' && (e.toLowerCase()).includes('subscribed')) {
    // if (typeof e === 'string' && (e.toLowerCase()).includes('subscribed')) {
      // txt.center('error fetching data. please check your API key.')
    // }
    // else {
      // txt.center(e)
    // }
    // else if (e.msg) txt.center(e.msg)
    console.log(e)
    process.exit(0)
  }
}

const mainLoop = (index = 0, data) => {
  const controls = fork(
    new URL('./controls.js', import.meta.url).pathname,
    [index, JSON.stringify(data)]
  )
  controls.on('message', m => {
    if (m.next === 'EXIT') {
      txt.center('exit')
      process.exit(0)
    }
    mainLoop(m.next, data)
  })
}

const run = async () => mainLoop(0, await getEnv())

run()
