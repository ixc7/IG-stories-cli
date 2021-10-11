import { fork } from 'child_process'
import { getSetKey } from '../actions/keys.js'
import { whichDir, upsertDir } from '../actions/directories.js'
import search from './search.js'

const env = async () => {
  try {  
    const apiKey = await getSetKey()
    const destination = await whichDir({ username: 'alice' })
    upsertDir(destination)

    console.log('searching')
    const data = await search('alice', apiKey)

    return {
      data,
      destination
    }
  }
  catch (e) {
    console.log(e)
    process.exit(0)
  }
}

const main = (index = 0, data) => {
  const controls = fork(
    new URL('./controls.js', import.meta.url).pathname,
    [index, JSON.stringify(data)]
  )
  controls.on('message', (m) => {
    if (m.next === 'EXIT') {
      console.log('done')
      process.exit(0)
    }
    main(m.next, data)
  })
}

const init = async () => main(0, await env())
init()
