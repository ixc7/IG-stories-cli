import fs from 'fs';
import inquirer from 'inquirer';
import { config } from './utils';

/* API KEYS */

// get/set API key
async function getAPIKey(
  options = {
    replace: false,
  },
) {
  const newAPIKey = config().APIKey && !options.replace
    ? config().APIKey
    : (
      await inquirer.prompt([
        {
          type: 'input',
          name: 'APIKey',
          message: 'rapidAPI key',
          validate(input) {
            if (typeof input === 'string' && !!input) return true;
            return 'value cannot be empty';
          },
        },
      ])
    ).APIKey;

  const updated = JSON.stringify(
    {
      ...config(),
      APIKey: newAPIKey,
    },
    null,
    2,
  );
  fs.writeFileSync('config.json', updated, {
    encoding: 'utf-8',
  });

  return newAPIKey;
}

// unset API key
function clearAPIKey() {
  const updated = JSON.stringify(
    {
      ...config(),
      APIKey: '',
    },
    null,
    2,
  );
  fs.writeFileSync('config.json', updated, {
    encoding: 'utf-8',
  });
}

export { getAPIKey, clearAPIKey };
