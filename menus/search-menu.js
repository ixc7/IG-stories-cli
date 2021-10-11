import { fork } from 'child_process'

export default async function searchMenu () {
  return new Promise((resolve, reject) => {
    const searchLoop = fork(
      new URL('../search/index.js', import.meta.url).pathname,
      ['alice']
    )
    searchLoop.on('close', () => resolve())
  })
}
