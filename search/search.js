import https from 'https'

// ---- SEARCH: get/format/return search results from rapidapi ---- //

export default function search (username, apiKey) {
  // ---- promisify
  return new Promise((resolve, reject) => {
    // ---- body
    const query = new URL('/clients/api/ig/ig_profile', 'https://instagram-bulk-profile-scrapper.p.rapidapi.com')
    query.searchParams.set('ig', username)
    query.searchParams.set('response_type', 'story')

    // ---- request
    const req = https.request(query.href)

    // ---- headers
    req.setHeader('x-rapidapi-host', 'instagram-bulk-profile-scrapper.p.rapidapi.com')
    req.setHeader('x-rapidapi-key', apiKey)

    // ---- handle response
    req.on('response', function (res) {

      // ---- capture response
      let dataStr = ''
      res.on('data', function (chunk) {
        dataStr += chunk.toString('utf8')
      })

      res.on('end', function () {
        const allMedia = JSON.parse(dataStr, 0, 2)
        
        // ---- if we received a valid response, format it
        if (allMedia[0]?.story?.data?.length) {
          const files = allMedia[0].story.data.map(function (item) {
            let formatted = {}
            // ---- is image
            if (item.media_type === 1) {
              formatted = {
                url: item.image_versions2.candidates[0].url,
                type: 'jpg',
                display: 'image'
              }
            }
            // ---- is video
            else if (item.media_type === 2) {
              formatted = {
                url: item.video_versions[0].url,
                type: 'mp4',
                display: 'video'
              }
            }
            return formatted
          })
          // ---- done
          resolve(files)  
        }

        // ---- exit if we didn't receive anything usable
        else {
          // ---- done
          reject('nothing found')
        }
      })
    })

    req.end()
  })
}
