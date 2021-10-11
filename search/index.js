import { fork } from 'child_process'
import { getSetKey } from '../actions/keys.js'
import { whichDir, upsertDir } from '../actions/directories.js'
import search from './search.js'

// if called as fork from main-menu, use process.argv[2] for username
const username = process.argv[2] || 'bob'

const getEnv = async () => {
  const apiKey = await getSetKey()
  const destination = await whichDir({ username })
  upsertDir(destination)
  
  // get input here
  
  try {
    const data = await search(username, apiKey)
    return {
      data,
      destination,
      username
    }
  }
  catch (e) {
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
      console.log('exit')
      process.exit(0)
    }
    mainLoop(m.next, data)
  })
}

const run = async () => mainLoop(0, await getEnv())

run()
