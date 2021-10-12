import { fork } from 'child_process'
import { getSetKey } from '../actions/apiKeys.js'
import { whichDir, upsertDir } from '../actions/directories.js'
import display from '../actions/display.js'
import search from './search.js'

const username = process.argv[2].replace(/\s/g, '') || false

if (!username) {
  display.term.reset()
  display.txt.center('username cannot be empty')
  process.exit(0)
}

const getEnv = async () => {
  const apiKey = await getSetKey()
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
    display.txt.center(e)
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
      display.txt.center('exit')
      process.exit(0)
    }
    mainLoop(m.next, data)
  })
}

const run = async () => mainLoop(0, await getEnv())

run()
