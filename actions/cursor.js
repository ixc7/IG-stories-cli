const cursor = {
  hide () {
    process.stdout.write('\u001b[?25l')
  },
  show () {
    process.stdout.write('\u001b[?25h')
  }
}

export default cursor
