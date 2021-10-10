import search from './search.js'
import { getSetKey } from '../actions/keys.js'

async function init () {
  search('alice', await getSetKey())
  .then((data) => console.log(data))  
}

init()
