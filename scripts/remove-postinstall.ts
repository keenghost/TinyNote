import fs from 'node:fs'

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8')) as {
  scripts: { postinstall?: string }
}

delete packageJson.scripts.postinstall

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2))
