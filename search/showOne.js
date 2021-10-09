
// showOne = render

function render (filePath) {

  const timg = spawn(
    new URL('../vendor/timg', import.meta.url).pathname,
    [
      `-g ${columns}x${rows - 4}`,
      '--center',
      filePath
    ]
  )
  
  timg.stdout.pipe(stdout)
  // .unpipe() ??

  timg.on('close', () => process.exit(0))

  // process.on('message', (msg) => {})
  // process.send({})

}
