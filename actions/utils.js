import fs from 'fs'

const config = () => {
  return JSON.parse(
    fs.readFileSync(new URL('../config.json', import.meta.url).pathname, {
      encoding: 'utf-8'
    })
  )
}

const makeName = (prefix = 'filename', extension = 'txt') => {
  const date = (new Date()).toDateString().toLowerCase().replace(/\s/g, '_')
  const str = (Math.random() + 1).toString(36).substring(2)
  return `${prefix}_${date}_${str}.${extension}`
}

export default {
  config,
  makeName
}
