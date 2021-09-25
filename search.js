/* eslint-disable no-console */
// import fs from 'fs'
// import path from 'path'
import readline from 'readline';
import { execSync } from 'child_process';
import axios from 'axios';
import inquirer from 'inquirer';
import { getDir, upsertDir } from './directories';
import { config, downloadAll, clearScrollBack } from './utils/utils';
import showMedia from './images';
import { addFavorite } from './favorites';
import { saveHistory } from './history';
import { getAPIKey } from './apiKeys';

/* SEARCH */

async function search(user) {
  // get username
  const username = user || (
    await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: 'instagram username',
        validate(input) {
          if (typeof input === 'string' && !!input) return true;
          return 'value cannot be empty';
        },
      },
    ])
  ).username;

  // get directory
  const destination = await getDir(username);

  // get data from API
  console.log('fetching data from API');
  const fetched = await axios.request({
    method: 'GET',
    url: 'https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/ig_profile',
    params: {
      ig: username,
      response_type: 'story',
    },
    headers: {
      'x-rapidapi-host': 'instagram-bulk-profile-scrapper.p.rapidapi.com',
      'x-rapidapi-key': await getAPIKey(),
    },
  });

  // if stories are found...
  if (fetched?.data[0]?.story?.data && fetched.data[0].story.data.length) {
    const count = {
      photo: 0,
      video: 0,
    };

    // map urls w/ file extensions
    const urls = fetched.data[0].story.data.map((item) => {
      if (item.media_type === 1) {
        count.photo += 1;
        return {
          url: item.image_versions2.candidates[0].url,
          type: 'jpg',
          display: 'image',
        };
      } if (item.media_type === 2) {
        count.video += 1;
        return {
          url: item.video_versions[0].url,
          type: 'mp4',
          display: 'video',
        };
      }
    });

    // mkdir
    upsertDir(destination);

    // choose stories to download
    const urlsToSave = [];
    for (let i = 0; i < urls.length; i += 1) {
      clearScrollBack();
      console.log(
        `found ${count.photo} ${count.photo === 1 ? 'photo' : 'photos'}`,
        `and ${count.video} ${count.video === 1 ? 'video' : 'videos'}`,
        `\nloading story ${i + 1} of ${urls.length} (${urls[i].display})`,
      );
      readline.cursorTo(process.stdout, 0, 4);
      process.stdout.write(showMedia(urls[i].url).stdout);
      readline.cursorTo(process.stdout, 0, process.stdout.rows);
      // eslint-disable-next-line no-await-in-loop
      const confirmDownload = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'save',
          message: `save ${i + 1}?`,
        },
      ]);
      if (confirmDownload.save) {
        urlsToSave.push(urls[i]);
      }
    }

    clearScrollBack();

    // if user selected anything to download...
    if (urlsToSave.length) {
      // download it
      await downloadAll(urlsToSave, destination, {
        console: true,
      });

      // add to history
      saveHistory(username);

      // save username y/n
      const confirmSave = (
        await inquirer.prompt([
          {
            type: 'confirm',
            name: 'save',
            message() {
              return `add '${username}?' to saved?`;
            },
            when() {
              return config().users.indexOf(username) === -1;
            },
          },
        ])
      ).save;

      if (confirmSave) {
        addFavorite(username);
        console.log('saved!');
      }

      // open directory and exit
      execSync(`open ${destination}`);
    }

    // if user selected NOTHING AT ALL...
    else {
      console.log('nothing selected');
    }
  }

  // if no stories are found...
  else {
    console.log('nothing found');
  }
}

export default search;
