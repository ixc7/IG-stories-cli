import path from 'path'
// import { spawnSync } from 'child_process'
import { spawn } from 'child_process'
import { __dirname } from './utils.js'

const cols = process.stdout.columns
const rows = process.stdout.rows

export default function showMedia (url) {
  // return spawnSync(path.resolve(__dirname, '../vendor/timg'), [
  return spawn(path.resolve(__dirname, '../vendor/timg'), [
    `-g ${cols}x${rows - 1}`,
    '--center',
    url
  ])
}
