import { spawn } from 'child_process'
import fs from 'fs'
import display from '../actions/display.js'

const file = process.argv[2]

const timg = spawn(
  new URL('../vendor/timg', import.meta.url).pathname,
  [
    `-g ${process.stdout.columns}x${process.stdout.rows - 4}`,
    '--center',
    file
  ]
)

timg.stdout.pipe(process.stdout)

timg.on('close', () => {
  /* eslint-disable-next-line quotes */
  display.txt.center(`press any key to continue, 's' to delete, 'q' to quit`, { clear: false })
})

process.on('message', m => {
  display.term.reset()
  if (m === 'q') {
    fs.rmSync(file)
    process.exit(1)
  }
  if (m === 's') {
    fs.rmSync(file)
  }
  process.exit(0)
})
