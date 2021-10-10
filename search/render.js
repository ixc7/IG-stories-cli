import { spawn } from 'child_process'

export default function render (filePath) {

  const timg = spawn(
    new URL('../vendor/timg', import.meta.url).pathname,
    [
      `-g ${process.stdout.columns}x${process.stdout.rows - 4}`,
      '--center',
      filePath
    ]
  )
  
  timg.stdout.pipe(process.stdout)
  timg.on('close', () => process.exit(0))

}

