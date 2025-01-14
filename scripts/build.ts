import minimist from 'minimist'
import child_process from 'node:child_process'
import fs from 'node:fs'
import pico from 'picocolors'

const args = minimist(process.argv.slice(2))
const projs = args._

if (projs.length === 0) {
  console.error(pico.red(`${pico.bgRed(pico.white(' ERR '))} No projects specified.\n`))
  process.exit(0)
}

for (const proj of projs) {
  if (!fs.existsSync(`packages/${proj}`)) {
    console.error(
      pico.red(
        `${pico.bgRed(pico.white(' ERR '))} Project ${pico.bold(proj)} does not exist.\n`
      )
    )
    process.exit(0)
  }
}

for (const proj of projs) {
  child_process.execSync('pnpm build', { cwd: `packages/${proj}`, stdio: 'inherit' })
  console.log(pico.white(`\n${pico.bgGreen(' OK ')} Project ${pico.blue(proj)} built.\n\n`))
}
