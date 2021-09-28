import { exec } from 'child_process'

/*
import path from 'path'
import { spawnSync } from 'child_process'
import { __dirname } from './utils.js'

export default function showMedia (url) {
  return spawnSync(path.resolve(__dirname, '../vendor/timg'), [
    `-g ${process.stdout.columns}x${process.stdout.rows - 10}`,
    '--compress',
    url
  ])
}
*/

const child = exec('timg file_example_MP4_640_3MG.mp4 -g100x100 -V --loops=-1', 'tput reset')

child.stdout.removeAllListeners("data")
child.stderr.removeAllListeners("data")
child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)



// var child = require('child_process').exec('python celulas.py')
// child.stdout.pipe(process.stdout)
// child.stderr.pipe(process.stdout)
// child.on('exit', function () {
  // // process.exit()
  // console.log('WE ARE DONE.')
// })
