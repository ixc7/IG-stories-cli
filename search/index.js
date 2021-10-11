import { fork } from 'child_process'
import { getSetKey } from '../actions/keys.js'
import { whichDir, upsertDir } from '../actions/directories.js'
import search from './search.js'

const getEnv = async () => {
  const apiKey = await getSetKey()
  const destination = await whichDir({ username: 'alice' })
  upsertDir(destination)
  const data = await search('alice', apiKey)
  return {
    data,
    destination
  }
}

const mainLoop = (index = 0, data) => {
  const controls = fork(
    new URL('./controls.js', import.meta.url).pathname,
    [index, JSON.stringify(data)]
  )
  controls.on('message', (m) => {
    if (m.next === 'EXIT') {
      console.log('exit')
      process.exit(0)
    }
    mainLoop(m.next, data)
  })
}

const run = async () => mainLoop(0, await getEnv())

run()

// export default init
