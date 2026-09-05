// Minimal ACP-over-stdio client shared by scripts/history-probe.mjs (plain
// node) and tests/frame-purity.test.ts (vitest). One spawn + newline-framed
// JSON-RPC multiplexer: req() resolves responses by id, notifications append
// to `frames`, server requests go to the onRequest hook, stderr is buffered,
// EOF waits for exit 0.
import { spawn } from 'node:child_process'

export function connect(bin, env, args = [], onRequest) {
  const child = spawn(process.execPath, [bin, ...args], {
    env: { ...process.env, ...env, NODE_PATH: undefined, NODE_OPTIONS: undefined },
    stdio: ['pipe', 'pipe', 'pipe'],
  })
  const frames = []
  const errbuf = []
  const pending = new Map()
  let buffer = ''
  let nextId = 1
  let code
  const exited = new Promise((resolve) => child.on('close', (c) => { code = c; resolve(c) }))
  child.stderr.on('data', (c) => errbuf.push(String(c)))
  child.stdout.on('data', (c) => {
    buffer += String(c)
    let idx
    while ((idx = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, idx)
      buffer = buffer.slice(idx + 1)
      if (line.length === 0) continue
      const frame = JSON.parse(line)
      frames.push(frame)
      if (frame.id !== undefined && frame.method !== undefined) {
        if (onRequest) onRequest(frame, (result) => {
          child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: frame.id, result }) + '\n')
        })
        continue
      }
      if (frame.id !== undefined) {
        const wait = pending.get(frame.id)
        if (wait) { pending.delete(frame.id); wait(frame) }
      }
    }
  })
  return {
    child,
    frames,
    exited,
    req(method, params) {
      const id = nextId++
      const promise = new Promise((resolve) => pending.set(id, resolve))
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n')
      return promise
    },
    closeStdin() { child.stdin.end() },
    exitCode() { return code !== undefined ? Promise.resolve(code) : exited },
    stderrText() { return errbuf.join('') },
  }
}
