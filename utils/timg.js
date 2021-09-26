import path from 'path';
import { spawnSync } from 'child_process';
import { __dirname } from './utils.js';

export default function timg(url) {
  // console.log('HERE');
  // console.log('IS IT HERE', path.resolve(__dirname, 'timg'));
  return spawnSync(path.resolve(__dirname, 'timg'), [
    `-g ${process.stdout.columns}x${process.stdout.rows - 10}`,
    '--compress',
    url,
  ]);
}
