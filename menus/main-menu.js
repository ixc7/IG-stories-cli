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
      await import('../search').default();
      await mainMenu();
    },
    async favoritesMenu() {
      const menu = './favorites-menu';
      await import(menu).default();
    },
    async historyMenu() {
      const menu = './history-menu';
      await import(menu).default();
    },
    async configMenu() {
      const menu = './config-menu';
      await import(menu).default();
    },
    exit() {
      // eslint-disable-next-line no-console
      return console.log('goodbye');
    },
  };

  await submenuMap[answers.submenu]();
}

export default mainMenu;
