/* eslint-disable */


import https from 'https'
import Progress from 'progress'

console.clear()
console.log('starting download')

// https://developer.mozilla.org/en-US/docs/Web/API/URL_API
const myUrl = new URL('/clients/api/ig/ig_profile', 'https://instagram-bulk-profile-scrapper.p.rapidapi.com')

// https://nodejs.org/api/url.html#url_url_searchparams
myUrl.searchParams.set('ig', 'alice')
myUrl.searchParams.set('response_type', 'story')

const myHttpsRequest = https.request(myUrl.href) 

// https://nodejs.org/api/http.html#http_request_setheader_name_value
myHttpsRequest.setHeader('x-rapidapi-host', 'instagram-bulk-profile-scrapper.p.rapidapi.com')
myHttpsRequest.setHeader('x-rapidapi-key', '9ddc074ad7mshe4cea43881459b3p1cdcfajsn8c1d26850b02')

myHttpsRequest.on('response', function (res) {

  let myData = ''
  
  const bar = new Progress('[:bar] :rate/bps :percent :etas', {
    complete: '#',
    incomplete: '_',
    width: Math.floor(process.stdout.columns / 3),
    total: parseInt(res.headers['content-length'], 10)
  })

  res.on('data', function (chunk) {
    myData += chunk.toString('utf8')
    bar.tick(chunk.length)
  })

  res.on('end', async function () {
    console.log('download complete')
    const fetched = JSON.parse(myData, 0, 2)
    const storyData = fetched[0].story.data[0].image_versions2.candidates[0].url
    console.log(storyData)
    process.exit(0)
  })

})

myHttpsRequest.end()




/*
req.on('response', async function (res) {
*/



/*...




...*/




/*

    const bar = new Progress('[:bar] :rate/bps :percent :etas', {
      complete: '#',
      incomplete: '_',
      width: Math.floor(process.stdout.columns / 3),
      total: parseInt(res.headers['content-length'], 10)
    })

    res.pipe(destination)

    res.on('data', function (chunk) {
      bar.tick(chunk.length)
    })

    res.on('end', async function () {
      console.log('download complete')
      process.exit(0)
    })

*/
  
// })

// req.end()

