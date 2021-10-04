import fs from 'fs'
import utils from './utils.js'

const { config } = utils

function setHistory (username) {
  const updated = JSON.stringify(
    {
      ...config(),
      history: [...config().history, username]
    },
    null,
    2
  )
  fs.writeFileSync('config.json', updated, {
    encoding: 'utf-8'
  })
}

function unsetHistory () {
  const updated = JSON.stringify(
    {
      ...config(),
      history: []
    },
    null,
    2
  )
  fs.writeFileSync('config.json', updated, {
    encoding: 'utf-8'
  })
}

export { setHistory, unsetHistory }
