import path from 'path';
import { spawnSync } from 'child_process';
import { __dirname } from './utils';

export default function timg(url) {
  return spawnSync(path.resolve(__dirname, 'timg'), [
    `-g ${process.stdout.columns}x${process.stdout.rows - 10}`,
    '--compress',
    url,
  ]);
}
