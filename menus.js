import inquirer from "inquirer";
import { search } from "./search.js";
import { getDir, checkDirExists, openDir, removeDir } from "./directories.js";
import { config, checkRepeat, checkConfirm } from "./utils.js";
import { removeFavorite, removeAllFavorites } from "./favorites.js";
import { clearHistory } from "./history.js";
import { getAPIKey, clearAPIKey } from "./apiKeys.js";

/* MAIN MENU */

async function mainMenu() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "submenu",
      message: "select an option",
      choices: [
        {
          value: "newSearch",
          name: "download stories",
        },
        {
          value: "favoritesMenu",
          name: "view saved users",
        },
        {
          value: "historyMenu",
          name: "view search history",
        },
        {
          value: "configMenu",
          name: "settings",
        },
        {
          value: "exit",
          name: "exit",
        },
      ],
    },
  ]);

  const submenuMap = {
    async newSearch() {
      await search();
      await mainMenu();
    },
    favoritesMenu,
    historyMenu,
    configMenu,
    exit() {
      return console.log("goodbye");
    },
  };

  await submenuMap[answers.submenu]();
}

/* FAVORITES */

async function favoritesMenu() {
  if (config().users.length) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "username",
        message: "select a user",
        choices: config().users,
      },
      {
        type: "list",
        name: "action",
        message: "select an action",
        choices: [
          {
            value: "getStories",
            name: "get latest stories",
          },
          {
            value: "getDownloads",
            name: "view downloaded stories",
          },
          {
            value: "removeDownloads",
            name: "remove downloaded stories",
          },
          {
            value: "removeSaved",
            name: "remove from saved",
          },
        ],
      },
      {
        type: "confirm",
        name: "confirmRemove",
        message(response) {
          return `remove '${response.username}?' from saved?`;
        },
        when(response) {
          return response.action === "removeSaved";
        },
      },
    ]);

    const username = answers.username;
    const location = await getDir(username);

    const favoritesMap = {
      async getStories() {
        await search(username);
      },
      getDownloads() {
        if (checkDirExists(location)) {
          openDir(location);
        } else {
          console.log("no downloads found");
        }
      },
      removeDownloads() {
        if (checkDirExists(location)) {
          removeDir(location);
        } else {
          console.log("no downloads found");
        }
      },
      removeSaved() {
        removeFavorite(username);
      },
    };

    await favoritesMap[answers.action]();
    await checkRepeat(favoritesMenu, mainMenu);
  } else {
    console.log("no saved users");
    await mainMenu();
  }
}

/* HISTORY */

async function historyMenu() {
  if (config().history.length) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "username",
        message: "select a user",
        choices: config().history,
      },
      {
        type: "list",
        name: "action",
        message: "select an action",
        choices: [
          {
            value: "getStories",
            name: "get latest stories",
          },
          {
            value: "getDownloads",
            name: "view downloaded stories",
          },
          {
            value: "removeDownloads",
            name: "remove downloaded stories",
          },
          // (optional): remove from history, add to saved
        ],
      },
    ]);

    const username = answers.username;

    if (answers.action === "getStories") {
      await search(username);
    } else if (answers.action === "getDownloads") {
      const location = await getDir(username);
      if (checkDirExists(location)) {
        openDir(location);
      } else {
        console.log("no downloads found");
      }
    } else if (answers.action === "removeDownloads") {
      const location = await getDir(username);
      if (checkDirExists(location)) {
        removeDir(location);
      } else {
        console.log("no downloads found");
      }
    }
    await checkRepeat(historyMenu, mainMenu);
  } else {
    console.log("no search history");
    await mainMenu();
  }
}

/* CONFIG */

async function configMenu() {
  const selection = (
    await inquirer.prompt([
      {
        type: "list",
        name: "selection",
        message: "select a field to edit",
        choices: [
          {
            value: "APIKey",
            name: "edit API Key", // edit/reset
          },
          {
            value: "destination",
            name: "edit destination folder", // edit/reset
          },
          {
            value: "history",
            name: "clear history", // enable/disable/reset/go to history prompt
          },
          {
            value: "saved",
            name: "clear saved users", // enable/disable/reset/ go to saved prompt
          },
        ],
      },
    ])
  ).selection;

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
  await checkRepeat(configMenu, mainMenu);
}

/* INIT */
// mainMenu()

export { mainMenu };
