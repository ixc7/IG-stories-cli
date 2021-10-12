import { stdin, stdout } from 'process'
import readline from 'readline'
import Progress from 'progress'

// ====
// TODO: colors

// ----
const cursor = {
  hide: () => stdout.write('\u001b[?25l'),
  show: () => stdout.write('\u001b[?25h'),
  to: (x, y) => readline.cursorTo(stdout, x, y)
}

// ----
const term = {
  reset: () => {
    cursor.show()
    stdout.write('\u001b[0m\u001b[3J\u001b[1J')
    console.clear()
  }
}

// ----
const txt = {
  center: (msg = '', opts = { clear: true }, pos = { x: stdout.columns, y: 0 }) => {
    if (opts.clear) term.reset()
    cursor.to(Math.floor((parseInt(pos.x) / 2) - (msg.length / 2)), parseInt(pos.y))
    stdin.write(`${msg}\n`)
  }
}

// ----
const progress = res => {
  const total = parseInt(res.headers['content-length'], 10)
  const spacing = ' '.repeat(Math.floor(stdout.columns / 4))

  if (isNaN(total)) return false

  const bar = new Progress(`${spacing}[:bar]`, {
    complete: '\u001b[102m \u001b[0m',
    incomplete: '_',
    width: Math.floor(stdout.columns / 2),
    total
  })

  res.on('data', chunk => bar.tick(chunk.length))
}

export default {
  term,
  txt,
  cursor,
  progress
}
