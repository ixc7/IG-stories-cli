/* eslint-disable */

import { fork } from 'child_process'
// import inquirer from 'inquirer'
// import mainMenu from './main-menu.js'
// import search from '../search/index.js'

export default async function searchMenu () {
  return new Promise((resolve, reject) => {
    
    const searchLoop = fork(
      new URL('../search/index.js', import.meta.url).pathname,
      ['alice']
    )

    searchLoop.on('close', () => resolve(true))
    
  })
}
