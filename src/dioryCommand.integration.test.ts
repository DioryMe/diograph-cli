import { Room } from '@diograph/diograph'
import { roomInFocus } from './configManager.js'
import { createAction, linkAction } from './dioryCommand.js'
import { describe, expect, it, mock, spyOn } from 'bun:test'

const demoContentDiograph = require('../tests/demo-content-room/diograph.json')

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
    expect(Object.keys(mockRoom.diograph.queryDiograph({ text: 'test' }).diograph)).toHaveLength(1)
  })
})

describe('linkAction', () => {
  it('links two diories', async () => {
    await linkAction('diory12', 'diory13')

    // Assert
    expect(roomInFocus).toHaveBeenCalled()
    expect(mockRoom.diograph.addDioryLink).toHaveBeenCalledWith(
      { id: 'diory12' },
      { id: 'diory13' },
    )

    expect(mockRoom.diograph.getDiory({ id: 'diory12' }).links).toEqual([{ id: 'diory13' }])
  })
})
