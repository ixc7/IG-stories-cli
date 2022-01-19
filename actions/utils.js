import { existsSync, readFileSync, writeFileSync } from 'fs'

const config = () => {
  const file = new URL('../config.json', import.meta.url).pathname
  if (!existsSync(file)) writeFileSync(file, '{}')
  return JSON.parse(readFileSync(file, { encoding: 'utf-8' }))
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
