/**
 * Vitest 4 on Windows fails suite registration when the process cwd uses a
 * lowercase drive letter (c:\...). Normalize to C:\ before spawning vitest.
 * See: https://github.com/vitest-dev/vitest/issues/10692
 */
import { spawnSync } from 'node:child_process'
import process from 'node:process'

const cwd = process.cwd().replace(/^([a-z]):/, (_, d) => `${d.toUpperCase()}:`)
const args = process.argv.slice(2)

const result = spawnSync('npx', ['vitest', ...args], {
  cwd,
  stdio: 'inherit',
  shell: true,
  env: process.env,
})

process.exit(result.status ?? 1)
