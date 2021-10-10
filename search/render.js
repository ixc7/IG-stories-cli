import { spawn } from 'child_process'
  
const timg = spawn(
  new URL('../vendor/timg', import.meta.url).pathname,
  [
    `-g ${process.stdout.columns}x${process.stdout.rows - 4}`,
    '--center',
    process.argv[2]
  ]
)

timg.stdout.pipe(process.stdout)

process.on('message', (m) => {
  console.log('exit render')
  process.exit(0)
})

timg.on('close', () => {
  console.log('done, press any key to exit')
})

