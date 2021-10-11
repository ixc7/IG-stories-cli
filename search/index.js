import { fork } from 'child_process'

async function run (index = 0) {

  const main = fork(
    new URL('./controls.js', import.meta.url).pathname,
    [index]
  )

  main.on( 'message', (m) => {
    if (m.next === 'EXIT') {
      console.log('closing index.js')
      process.exit(0)
    } else {
      // run(index + 1)
      run(m.next)
    }
  })

}

run(0)
