import { describe, expect, test } from 'bun:test'
import scenes from './scenes'

describe('scenes', () => {
  test('has 100 scenes', () => {
    expect(scenes).toHaveLength(100)
  })
})
