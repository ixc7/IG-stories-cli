import fs from 'fs'
import { config } from './utils.js'

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
