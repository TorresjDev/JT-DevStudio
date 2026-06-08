import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('UGC media bucket', () => {
  it('uses the ugc-media bucket name', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'src/lib/ugc/media.ts'),
      'utf8'
    )

    expect(source).toContain("const BUCKET_NAME = 'ugc-media'")
    expect(source).not.toContain("const BUCKET_NAME = 'ugc-main'")
  })
})
