import readline from 'readline'
import search from './search.js'
import download from './download.js'
import { getSetKey } from '../actions/keys.js'
import { whichDir, upsertDir } from '../actions/directories.js'

const getDestination = async (username) => {
  const dir = await whichDir({ username })
  upsertDir(dir)
  readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return dir
}

async function init () {
  search('alice', await getSetKey())
  .then(async (data) => {
  
    console.log(data)
    download('alice', data[0], await getDestination('alice'))
    .then((file) => console.log(file))
  })  
  .catch((err) => console.log(err))
}

init()
