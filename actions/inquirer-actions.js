import inquirer from 'inquirer'

async function repeatPrompt (message = ' ') {
  return (
    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'repeat',
        message
      }
    ])
  ).repeat
}

async function checkRepeat (
  prompt,
  callback = async function () {},
  message = 'do more?'
) {
  if (await repeatPrompt(message)) {
    await prompt()
  } else {
    await callback()
  }
}

async function checkConfirm (message = 'proceed?') {
  return (
    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'checkConfirm',
        message
      }
    ])
  ).checkConfirm
}

export { checkRepeat, checkConfirm }
