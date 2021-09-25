import inquirer from 'inquirer';
import { checkRepeat, checkConfirm } from '../utils/inquirer-utils';
import { getAPIKey, clearAPIKey } from '../apiKeys';
import { clearHistory } from '../history';
import { removeAllFavorites } from '../favorites';
import { getDir } from '../directories';

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
