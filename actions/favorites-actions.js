import fs from 'fs';
import { config } from '../utils/utils';

/* FAVORITES */

// add user to 'favorites'
function addFavorite(username) {
  const updated = JSON.stringify(
    {
      ...config(),
      users: [...config().users, username],
    },
    null,
    2,
  );
  fs.writeFileSync('config.json', updated, {
    encoding: 'utf-8',
  });
}

// remove user from 'favorites'
function removeFavorite(username) {
  const users = config().users.filter((item) => item !== username);
  const updated = JSON.stringify(
    {
      ...config(),
      users,
    },
    null,
    2,
  );
  fs.writeFileSync('config.json', updated, {
    encoding: 'utf-8',
  });
}

// remove all users from 'favorites'
function removeAllFavorites() {
  const updated = JSON.stringify({
    ...config(),
    users: [],
  });
  fs.writeFileSync('config.json', updated, {
    encoding: 'utf-8',
  });
}

export { addFavorite, removeFavorite, removeAllFavorites };
