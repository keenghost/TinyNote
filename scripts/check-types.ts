import child_process from 'node:child_process'
import fs from 'node:fs'

child_process.execSync('pnpm tsc --incremental --noEmit')

const pkgs = fs.readdirSync('packages')

for (const pkg of pkgs) {
  child_process.execSync('pnpm  tsc --incremental --noEmit', { cwd: `packages/${pkg}` })
}
