// GitHub Pages SPA fallback: 404.html for unknown paths, index.html copies for known routes (HTTP 200).
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dist = 'dist'
const index = join(dist, 'index.html')
copyFileSync(index, join(dist, '404.html'))

const source = readFileSync('src/content/projects.ts', 'utf8')
const slugs = [...source.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
const routes = ['about', 'works', 'services', 'contact', ...slugs.map((s) => `works/${s}`)]

for (const route of routes) {
  const file = join(dist, `${route}.html`)
  mkdirSync(join(file, '..'), { recursive: true })
  copyFileSync(index, file)
}
copyFileSync(index, join(dist, 'works', 'index.html'))
console.log(`spa-fallback: 404.html + ${routes.length} routes`)
