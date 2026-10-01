#!/usr/bin/env node
// Release gate for the tag convention (AGENTS.md "Releasing"):
// package.json.version == CHANGELOG top heading == annotated tag vX.Y.Z,
// the worktree is clean, and lib/ is a fresh build of src/.
// Read-only apart from the build: it never tags and never pushes.
//   pnpm release:check                 # full gate (rebuilds lib/)
//   pnpm release:check --skip-build    # skip the lib/ freshness proof
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
const tryGit = (...args) => {
  try {
    return git(...args)
  } catch {
    return null
  }
}
const isAncestor = (ref) => tryGit('merge-base', '--is-ancestor', ref, 'HEAD') !== null

const failures = []
const check = (ok, label, detail = '') => {
  if (!ok) failures.push(`${label}${detail ? `: ${detail}` : ''}`)
  console.error(`[release:check] ${ok ? 'ok' : 'FAIL'} — ${label}${detail ? ` (${detail})` : ''}`)
  return ok
}

const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const version = manifest.version
const tag = `v${version}`
const corridor = manifest.dependencies['@deepseek-ai/dsh-agent']

check(git('status', '--porcelain', '--untracked-files=no') === '', 'worktree clean (tracked files)')
const branch = git('rev-parse', '--abbrev-ref', 'HEAD')
check(branch === 'main', 'on main', branch)
if (tryGit('rev-parse', '--verify', '--quiet', 'origin/main') !== null) {
  const [behind, ahead] = git('rev-list', '--left-right', '--count', 'origin/main...HEAD')
    .split(/\s+/)
    .map(Number)
  check(behind === 0, 'origin/main is not ahead of HEAD', `${behind} commit(s) behind`)
  if (ahead > 0) console.error(`[release:check] note — HEAD is ${ahead} commit(s) ahead of origin/main; push after tagging`)
}

// `## [Unreleased] — 0.5.0` reads as "Unreleased" on purpose: the heading must
// name the released version, not carry the next one in its title.
const heading = readFileSync(join(root, 'CHANGELOG.md'), 'utf8').match(/^## \[?([^\]]+?)\]?(?:\s|$)/m)?.[1] ?? ''
check(heading === version, 'CHANGELOG top heading matches package.json.version', `changelog="${heading}" package="${version}"`)

const kind = tryGit('cat-file', '-t', tag)
check(kind === 'tag', `${tag} exists as an annotated tag`, kind ?? 'missing')
if (kind !== null) check(isAncestor(tag), `${tag} is an ancestor of HEAD`)
else {
  const previous = git('tag', '-l', 'v*', '--sort=-v:refname')
    .split('\n')
    .find((t) => t !== tag && isAncestor(t))
  const from = previous && JSON.parse(tryGit('show', `${previous}:package.json`) ?? '{}').dependencies?.['@deepseek-ai/dsh-agent']
  console.error('[release:check] tag it with:')
  console.error(`  git tag -a ${tag} -m "${manifest.name} ${version} — <headline>" -m "dsh corridor: ${from ?? '?'} -> ${corridor}"`)
  console.error(`  git push origin main ${tag}`)
}

if (!process.argv.includes('--skip-build')) {
  execFileSync('pnpm', ['build'], { cwd: root, stdio: 'inherit' })
  const stale = git('status', '--porcelain', 'lib')
  check(stale === '', 'lib/ matches a fresh build of src/', stale.split('\n')[0])
}

if (failures.length > 0) {
  console.error(`[release:check] ${failures.length} failure(s) — not releasable`)
  process.exit(1)
}
console.error('[release:check] ok — ready to tag and push')
