/* eslint-disable no-console */
import inquirer from 'inquirer';
import search from '../actions/search-actions.js';
import {
  getDir, checkDirExists, openDir, removeDir,
} from '../actions/directory-actions.js';
import { config } from '../utils/utils';
import { checkRepeat } from '../utils/inquirer-utils';
import { removeFavorite } from '../actions/favorites-actions.js';
import mainMenu from './main-menu.js';

export default async function favoritesMenu() {
  if (config().users.length) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'username',
        message: 'select a user',
        choices: config().users,
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
          {
            value: 'removeSaved',
            name: 'remove from saved',
          },
        ],
      },
      {
        type: 'confirm',
        name: 'confirmRemove',
        message(response) {
          return `remove '${response.username}?' from saved?`;
        },
        when(response) {
          return response.action === 'removeSaved';
        },
      },
    ]);

    const { username } = answers;
    const location = await getDir(username);

    const actions = {
      async getStories() {
        await search(username);
      },
      getDownloads() {
        if (checkDirExists(location)) {
          openDir(location);
        } else {
          console.log('no downloads found');
        }
      },
      removeDownloads() {
        if (checkDirExists(location)) {
          removeDir(location);
        } else {
          console.log('no downloads found');
        }
      },
      removeSaved() {
        removeFavorite(username);
      },
    };

    await actions[answers.action]();
    await checkRepeat(favoritesMenu, mainMenu);
  } else {
    console.log('no saved users');
    await mainMenu();
  }
}
