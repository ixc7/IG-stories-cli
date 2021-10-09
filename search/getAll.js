
// getAll = search

function search ( ... ) {
  const url = new URL( ... )
  const req = https.request(url.href)
  let acc = ''
  
  req.on('response', (res) => {
    res.on('data', (d) => acc += d.toString('utf8'))
    // TODO use buffer instead ??
    
    res.on('end', () => {
      const data = JSON.parse(acc, 0, 2)
      if (data) { 
        download( ... )
      } else {
        process.exit(0)
      }
    })
  })
  
  req.end()
}
