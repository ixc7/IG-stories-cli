import readline from 'readline'
const { stdin } = process

function listen () {
  readline.emitKeypressEvents(stdin)
  stdin.setRawMode(true)
}

function close () {
  stdin.removeAllListeners('keypress')
}

function reload () {
  close()
  listen()
}

function keyListener (actions = {}) {
  stdin.on('keypress', (str) => {
    if (Object.prototype.hasOwnProperty.call(actions, str)) actions[str]()
  })
}

function sigintListener (str = 'q') {
  keyListener({
    [str]: () => process.kill(process.pid, 'SIGINT')
  })
}

export default {
  // open,
  listen,
  close,
  reload,
  keyListener,
  sigintListener
}
