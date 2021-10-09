
// getOne = download

function download ( ... ) {

  // if (opts.int === opts.max) process.exit(0)
  // TODO: don't use

  const stream = fs.createWriteStream(filePath)
  const req = https.request(current.url)

  req.on('response', (res) => {
  
    display.progress(res)

    res.pipe(stream)

    res.on('end', () => {
      render( ... )
      process.exit(0)
    })
    
    // process.on('message', (msg) => {})
    // process.send({})
    // TODO: rm file
    
  })
  
  req.end()
}

