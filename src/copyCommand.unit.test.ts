import { parseDioryStringArguments } from './copyCommand'
import chalk from 'chalk'
import { describe, expect, it, mock, spyOn, beforeEach, afterEach } from 'bun:test'

describe('parseDioryStringArguments', () => {
  it('should throw if toDioryString does not include ":"', () => {
    expect(() => parseDioryStringArguments('room-id:diory1', 'diory2')).toThrow(
      'toDiory must include a room-id',
    )
  })
})
