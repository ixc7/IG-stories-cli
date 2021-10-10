function download ( ... ) {

  const fileStream = fs.createWriteStream(filePath)
  const req = https.request(current.url)
  
  req.on('response', (res) => {

    res.pipe(fileStream)
    res.on('end', () => {

      render( ... )

      process.exit(0)
    })
  })
  
  req.end()
}

