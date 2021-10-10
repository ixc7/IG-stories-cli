
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
  timg.on('close', () => process.exit(0))

}

