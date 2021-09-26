import fs from 'fs';
import { config } from '../utils/utils.js';

function saveHistory(username) {
  const updated = JSON.stringify(
    {
      ...config(),
      history: [...config().history, username],
    },
    null,
    2,
  );
  fs.writeFileSync('config.json', updated, {
    encoding: 'utf-8',
  });
}

function clearHistory() {
  const updated = JSON.stringify(
    {
      ...config(),
      history: [],
    },
    null,
    2,
  );
  fs.writeFileSync('config.json', updated, {
    encoding: 'utf-8',
  });
}

export { saveHistory, clearHistory };
