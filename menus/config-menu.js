import inquirer from 'inquirer';
import { checkRepeat, checkConfirm } from '../utils/inquirer-utils.js';
import { getAPIKey, clearAPIKey } from '../utils/api-keys.js';
import { clearHistory } from '../actions/history-actions.js';
import { removeAllFavorites } from '../actions/favorites-actions.js';
import { getDir } from '../actions/directory-actions.js';

async function configMenu() {
  const { selection } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selection',
      message: 'select a field to edit',
      choices: [
        {
          value: 'APIKey',
          name: 'edit API Key', // edit/reset
        },
        {
          value: 'destination',
          name: 'edit destination folder', // edit/reset
        },
        {
          value: 'history',
          name: 'clear history', // enable/disable/reset/go to history prompt
        },
        {
          value: 'saved',
          name: 'clear saved users', // enable/disable/reset/ go to saved prompt
        },
      ],
    },
  ]);

  const actions = {
    async APIKey() {
      if (await checkConfirm()) {
        clearAPIKey();
        await getAPIKey({
          replace: true,
        });
      }
    },
    async destination() {
      if (await checkConfirm()) {
        await getDir(null, {
          replace: true,
        });
      }
    },
    async history() {
      if (await checkConfirm()) {
        clearHistory();
      }
    },
    async saved() {
      if (await checkConfirm()) {
        removeAllFavorites();
      }
    },
  };

  await actions[selection]();
  const mainMenu = await import('./main-menu');
  await checkRepeat(configMenu, mainMenu);
}

export default configMenu;
