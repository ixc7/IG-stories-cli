import { fork } from 'child_process'
import readline from 'readline'
import download from './download.js'
import display from '../actions/display.js'

const controls = async () => {
  const index = parseInt(process.argv[2])
  const env = JSON.parse(process.argv[3])
  const { data, username, destination } = env

  display.txt.center(`downloading ${index + 1} of ${data.length}`)
  const file = await download(username, data[index], destination)

  readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const render = fork(
    new URL('./render.js', import.meta.url).pathname,
    [file]
  )

  process.stdin.on('keypress', m => render.send(m))

  render.on('close', code => {
    if (index >= data.length - 1 || code === 1) {
      process.send({ next: 'EXIT' })
      process.exit(0)
    } else {
      process.send({ next: index + 1 })
      process.exit(0)
    }
  })
}

controls()
