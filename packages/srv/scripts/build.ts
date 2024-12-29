import child_process from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

try {
  fs.rmSync('dist', { recursive: true })
} catch {}

fs.mkdirSync('dist')

child_process.execSync('pnpm tsc --noEmit false --incremental false')

fs.mkdirSync('dist/runtime')

fs.copyFileSync('package.json', 'dist/package.json')

function importDotJs(inPath: string) {
  const dirs = fs.readdirSync(inPath).map(item => path.resolve(inPath, item))

  for (const dir of dirs) {
    const stat = fs.statSync(dir)

    if (stat.isDirectory()) {
      importDotJs(dir)
    }

    if (/\.js$/.test(dir)) {
      const content = fs.readFileSync(dir, { encoding: 'utf-8' })
      const newContent = content
        .replace(/(import\s+.*\s+from\s+['"])(?!.*\.js)(\.?\.\/.*)(['"])/g, '$1$2.js$3')
        .replace(/(export\s+.*\s+from\s+['"])(?!.*\.js)(\.?\.\/.*)(['"])/g, '$1$2.js$3')
      fs.writeFileSync(dir, newContent, { encoding: 'utf-8' })
    }
  }
}

importDotJs(path.resolve('dist'))
