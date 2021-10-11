import https from 'https'
import fs from 'fs'
import display from '../actions/display.js'
import utils from '../actions/utils.js'

export default function download (username, item, dir) {
  return new Promise((resolve, reject) => {
    const filePath = new URL(
      `${dir}/${utils.makeName(username, item.type)}`,
      import.meta.url
    ).pathname
    const writeStream = fs.createWriteStream(filePath)
    const req = https.request(item.url)

    req.on('response', (res) => {
      display.progress(res)
      res.pipe(writeStream)

      res.on('end', () => {
        resolve(filePath)
      })
    })

    req.end()
  })
}
