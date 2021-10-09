// /* eslint-disable */
// import readline from 'readline'
// import https from 'https'
// import fs from 'fs'
// import { stdout } from 'process'
// import { spawn } from 'child_process'
// import inquirer from 'inquirer'
// 
// import { whichDir, upsertDir /* , rmDir */ } from '../actions/directories.js'
// import { getSetKey } from '../actions/keys.js'
// import keyboard from '../actions/keyboard.js'
// import display from '../actions/display.js'
// import utils from '../actions/utils.js'
// 
// const { rows, columns } = stdout
// 
// function sigintExit () {
  // display.term.reset()
  // console.log('SIGINT EXITTTTTTTTTT')
  // // display.txt.center('SIGINT exit')
  // process.exit(0)
// }
// 
// // ----
// function getAll (username, apiKey, destination) {
  // display.cursor.hide()
  // keyboard.open()
  // keyboard.sigintListener(() => {
    // console.log('GETALL FUCK YOU')
    // process.exit(0)
    // // sigintExit()
  // })
  // console.log(`searching for '${username}'`)
  // // display.txt.center(`searching for '${username}'`)
// 
  // const query = new URL('/clients/api/ig/ig_profile', 'https://instagram-bulk-profile-scrapper.p.rapidapi.com')
  // query.searchParams.set('ig', username)
  // query.searchParams.set('response_type', 'story')
// 
  // const req = https.request(query.href)
  // req.setHeader('x-rapidapi-host', 'instagram-bulk-profile-scrapper.p.rapidapi.com')
  // req.setHeader('x-rapidapi-key', apiKey)
// 
  // req.on('response', function (res) {
    // let dataStr = ''
// 
    // res.on('data', function (chunk) {
      // dataStr += chunk.toString('utf8')
    // })
    // display.progress(res)
// 
    // res.on('end', function () {
      // const dataObj = JSON.parse(dataStr, 0, 2)
      // 
// 
      // if (dataObj[0]?.story?.data?.length) {
        // const filesList = dataObj[0].story.data.map(function (item) {
          // let itemInfo = {}
// 
          // if (item.media_type === 1) {
            // itemInfo = {
              // url: item.image_versions2.candidates[0].url,
              // type: 'jpg',
              // display: 'image'
            // }
          // } else if (item.media_type === 2) {
            // itemInfo = {
              // url: item.video_versions[0].url,
              // type: 'mp4',
              // display: 'video'
            // }
          // }
          // return itemInfo
        // })
// 
        // getOne(destination, {
          // username,
          // data: filesList,
          // int: 0,
          // max: filesList.length
        // })
      // } else {
        // console.log('nothing found')
        // // display.txt.center('nothing found')
        // display.cursor.show()
        // console.log(dataObj)
        // process.exit(0)
      // }
    // })
  // })
  // req.end()
// }
// 
// // ----
// function getOne (destination, opts) {
  // if (opts.int === opts.max) {
    // console.log('done')
    // // display.txt.center('done')
    // display.cursor.show()
    // process.exit(0)
  // }
  // // TODO: abort req (?)
  // display.cursor.hide()
  // keyboard.reload()
  // keyboard.sigintListener(() => {
    // console.log('GET 1')
    // console.log(`lYOU DIED ON ${opts.int + 1} of ${opts.max}`)
    // process.exit(0)
    // // rendered.stdout.unpipe(stdout)
  // })
  // console.log(`loading preview ${opts.int + 1} of ${opts.max}`)
  // // display.txt.center(`loading preview ${opts.int + 1} of ${opts.max}`)
// 
  // const current = opts.data[opts.int]
  // const fileName = utils.makeName(opts.username, current.type)
  // const filePath = new URL(`${destination}/${fileName}`, import.meta.url).pathname
  // const stream = fs.createWriteStream(filePath)
  // const req = https.request(current.url)
// 
  // req.on('response', (res) => {
    // stdout.write('\n')
    // display.progress(res)
    // res.pipe(stream)
    // // TODO: ANOTHER SIGINT LISTENER TO UNPIPE THIS TOO??
// 
    // res.on('end', () => {
      // showOne(destination, filePath, opts)
    // })
  // })
  // 
  // req.end()
// }
// 

// 
// // ----
// function showOne (destination, filePath, opts) {
  // display.cursor.hide()
  // keyboard.reload()
  // display.txt.center('y: keep, n: skip, q: quit')
  // // keyboard.sigintListener(() => display.term.reset())
// 
  // const rendered = spawn(
    // new URL('../vendor/timg', import.meta.url).pathname,
    // [
      // `-g ${columns}x${rows - 4}`,
      // '--center',
      // filePath
    // ]
  // )
  // rendered.stdout.pipe(stdout)
// 
  // keyboard.sigintListener(() => {
    // rendered.stdout.unpipe(stdout)
    // console.log('YOU DID ITY frum daddy YOU DID IT. thnx1')
    // process.exit(0)
  // })
  // 
  // let signal = ''
  // keyboard.keyListener({
    // y: () => {
      // signal = 'save'
      // rendered.kill()
    // },
    // n: () => {
      // signal = 'skip'
      // fs.rmSync(filePath)
      // rendered.kill()
    // }
  // })
// 
  // rendered.on('close', () => {
    // display.cursor.hide()
    // 
    // function getNext () {
      // process.removeAllListeners('SIGINT')
      // getOne(destination, {
        // ...opts,
        // int: opts.int + 1
      // })
    // }
    // 
    // if (signal === 'skip' || signal === 'save') {
      // getNext()
    // } else {
      // keyboard.reload()
      // keyboard.sigintListener(() => {
          // rendered.stdout.unpipe(stdout)
          // console.log('YOU DID ITY AGAIN IN HELL DADDU')
              // process.exit(0)
// 
      // })
// 
      // keyboard.keyListener({
        // y: () => getNext(),
        // n: () => {
          // fs.rmSync(filePath)
          // getNext()
        // }
      // })
    // }
  // })
// }

// ----
// async function init () {
  // const apiKey = await getSetKey()
// 
  // const username = (await inquirer.prompt([
    // {
      // type: 'input',
      // name: 'username',
      // message: 'type a username to search'
    // }
  // ])).username
// 
  // const getDestination = async () => {
    // const dir = await whichDir({ username })
    // upsertDir(dir)
    // readline.createInterface({
      // input: process.stdin,
      // output: process.stdout
    // })
    // return dir
  // }
// 
  // const destination = await getDestination()
  // getAll(username, apiKey, destination)
// }
// 
// init()
// export default init
