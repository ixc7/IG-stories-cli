/* eslint-disable no-console */
import inquirer from 'inquirer';
import {
  getDir, checkDirExists, openDir, removeDir,
} from '../directories';
import { config } from '../utils/utils';
import { checkRepeat } from '../utils/inquirer-utils';
import search from '../search';
import mainMenu from './main-menu';

export default async function historyMenu() {
  if (config().history.length) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'username',
        message: 'select a user',
        choices: config().history,
      },
      {
        type: 'list',
        name: 'action',
        message: 'select an action',
        choices: [
          {
            value: 'getStories',
            name: 'get latest stories',
          },
          {
            value: 'getDownloads',
            name: 'view downloaded stories',
          },
          {
            value: 'removeDownloads',
            name: 'remove downloaded stories',
          },
          // (optional): remove from history, add to saved
        ],
      },
    ]);

    const { username } = answers;

    if (answers.action === 'getStories') {
      await search(username);
    } else if (answers.action === 'getDownloads') {
      const location = await getDir(username);
      if (checkDirExists(location)) {
        openDir(location);
      } else {
        console.log('no downloads found');
      }
    } else if (answers.action === 'removeDownloads') {
      const location = await getDir(username);
      if (checkDirExists(location)) {
        removeDir(location);
      } else {
        console.log('no downloads found');
      }
    }
    await checkRepeat(historyMenu, mainMenu);
  } else {
    console.log('no search history');
    await mainMenu();
  }
}
