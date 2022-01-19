import { existsSync, readFileSync, writeFileSync } from 'fs'

const config = () => {
  const file = new URL('../config.json', import.meta.url).pathname
  if (!existsSync(file)) {
    console.log('config.json not found. creating...')
    writeFileSync(file, '{}')
  } 
    
  return JSON.parse(readFileSync(file, { encoding: 'utf-8' }))
}

const makeName = (prefix = 'filename', extension = 'txt') => {
  const date = (new Date()).toDateString().toLowerCase().replace(/\s/g, '_')
  const str = (Math.random() + 1).toString(36).substring(2)
  return `${prefix}_${date}_${str}.${extension}`
}

export { config, makeName }
