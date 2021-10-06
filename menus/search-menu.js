import search from '../actions/search.js'
import mainMenu from './main-menu.js'

async function after () {
  process.stdin.removeAllListeners('keypress')
  process.removeAllListeners('SIGINT')
  console.clear()
  await mainMenu()
}

export default async function searchMenu () {
  search(after).init()
}
