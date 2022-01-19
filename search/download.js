import https from 'https'
import fs from 'fs'
import display from '../actions/display.js'
import { makeName } from '../actions/utils.js'

export default function download (username, item, dir) {
  return new Promise((resolve, reject) => {
    const file = new URL(
      `${dir}/${makeName(username, item.type)}`,
      import.meta.url
    ).pathname

    const writeStream = fs.createWriteStream(file)
    const req = https.request(item.url)

    req.on('response', res => {
      display.progress(res)
      res.pipe(writeStream)

      res.on('end', () => resolve(file))

      res.on('error', e => reject(e))
    })

    req.end()
  })
}
