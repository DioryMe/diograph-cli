import { Room } from '@diograph/diograph'
import { roomInFocus } from './configManager.js'
import { createAction, linkAction } from './dioryCommand.js'
import { describe, expect, it, mock, spyOn } from 'bun:test'

const demoContentDiograph = require('../tests/demo-content-room/diograph.json')
// TODO: Make launch.json to debug this

const mockRoom = new Room()
mockRoom.diograph.initialise(demoContentDiograph)
mockRoom.saveRoom = mock()
spyOn(mockRoom.diograph, 'addDiory')
spyOn(mockRoom.diograph, 'addDioryLink')

mock.module('./configManager', () => {
  return {
    roomInFocus: mock(mockRoom),
  }
})

describe('createAction', () => {
  it('creates a diory', async () => {
    const mockText = 'test text'

    await createAction(mockText)

    // Assert
    expect(roomInFocus).toHaveBeenCalled()
    expect(mockRoom.saveRoom).toHaveBeenCalled()
    expect(mockRoom.diograph.addDiory).toHaveBeenCalledWith({
      id: expect.any(String),
      text: mockText,
    })

    // TODO: Verify that the diory was actually created
    expect(Object.keys(mockRoom.diograph)).toHaveLength(14)
  })
})

describe('linkAction', () => {
  it('links two diories', async () => {
    await linkAction('fromId', 'toId')

    // Assert
    expect(roomInFocus).toHaveBeenCalled()
    expect(mockRoom.diograph.addDioryLink).toHaveBeenCalledWith({ id: 'fromId' }, { id: 'toId' })

    // TODO: Verify that the diories were actually linked
  })
})
