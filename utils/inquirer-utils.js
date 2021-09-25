import inquirer from 'inquirer';

/* INQUIRER METHODS  */

async function repeatPrompt(message = ' ') {
  return (
    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'repeat',
        message,
      },
    ])
  ).repeat;
}

async function checkRepeat(
  prompt,
  callback = async () => { },
  message = 'do more?',
) {
  if (await repeatPrompt(message)) {
    await prompt();
  } else {
    await callback();
  }
}

async function checkConfirm(message = 'proceed?') {
  return (
    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'checkConfirm',
        message,
      },
    ])
  ).checkConfirm;
}

export { checkRepeat, checkConfirm };
