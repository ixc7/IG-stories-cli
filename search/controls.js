import readline from 'readline'
import search from './search.js'
import download from './download.js'
import render from './render.js'
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
  console.log('searching')
  search('alice', await getSetKey())
  .then(async (data) => {
    console.log('downloading')
    download('alice', data[2], await getDestination('alice'))
    .then((file) => {
      console.log('rendering')
      render(file)
    })
  })  
  .catch((err) => console.log(err))
}

init()
