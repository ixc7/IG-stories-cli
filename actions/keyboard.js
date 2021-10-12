import { stdin, stdout } from 'process'
import { spawn } from 'child_process'
import readline from 'readline'

const open = () => {
  readline.emitKeypressEvents(stdin)
  stdin.setRawMode(true)
}

const close = () => stdin.removeAllListeners('keypress')

const reload = () => {
  close()
  open()
}

const keyListener = (actions = {}) => {
  stdin.on('keypress', str => {
    if (Object.prototype.hasOwnProperty.call(actions, str)) actions[str]()
  })
}

const sigintListener = (
  action = () => { process.exit(0) },
  str = 'q'
) => {
  process.on('SIGINT', () => {
    const cleanup = spawn('tput', ['reset'])
    cleanup.stdout.pipe(stdout)
    cleanup.on('close', () => action())
  })
  keyListener({
    [str]: () => process.kill(process.pid, 'SIGINT')
  })
}

export default {
  open,
  close,
  reload,
  keyListener,
  sigintListener
}
