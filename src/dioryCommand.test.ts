import { Room } from '@diograph/diograph'
import { roomInFocus } from './configManager.js'
import { createAction } from './dioryCommand.js'
import { describe, expect, it, mock, spyOn } from 'bun:test'

const mockRoom = new Room()
mockRoom.saveRoom = mock()
spyOn(mockRoom.diograph, 'addDiory')

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
  })
})
