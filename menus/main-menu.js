import inquirer from 'inquirer';

/* MAIN MENU */

async function mainMenu() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'submenu',
      message: 'select an option',
      choices: [
        {
          value: 'newSearch',
          name: 'download stories',
        },
        {
          value: 'favoritesMenu',
          name: 'view saved users',
        },
        {
          value: 'historyMenu',
          name: 'view search history',
        },
        {
          value: 'configMenu',
          name: 'settings',
        },
        {
          value: 'exit',
          name: 'exit',
        },
      ],
    },
  ]);

  const submenuMap = {
    async newSearch() {
      const menu = '../actions/search-actions.js';
      await (await import(menu)).default();
      // await (import('../actions/search-actions.js')).default();
      await mainMenu();
    },
    async favoritesMenu() {
      const menu = './favorites-menu.js';
      await (await import(menu)).default();
    },
    async historyMenu() {
      const menu = './history-menu.js';
      await (await import(menu)).default();
    },
    async configMenu() {
      const menu = './config-menu.js';
      await (await import(menu)).default();
    },
    exit() {
      // eslint-disable-next-line no-console
      return console.log('goodbye');
    },
  };

  await submenuMap[answers.submenu]();
}

export default mainMenu;
