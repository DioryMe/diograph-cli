import { describe, expect, it, mock, spyOn, beforeEach } from 'bun:test'
import { RoomConfigData } from '@diograph/diograph/types'
import { createAction } from './roomCommand.js'
import { getAvailableClients } from './utils/getAvailableClients.js'
import { Room, constructAndLoadRoomWithNativeConnection } from '@diograph/diograph'
import { addRoom } from './utils/configManager.js'
import { setRoomInFocus } from './utils/setInFocus.js'

const demoContentDiograph = require('../tests/demo-content-room/diograph.json')

const roomConfig: RoomConfigData = {
  id: 'room-1',
  address: 'demo-content-room',
  clientType: 'LocalClient',
}

beforeEach(() => {
  const mockRoom = new Room()
  mockRoom.diograph.initialise(demoContentDiograph)
  mockRoom.saveRoom = mock()

  mock.module('@diograph/diograph', () => {
    return {
      constructAndLoadRoomWithNativeConnection: mock(mockRoom),
    }
  })

  mock.module('./utils/getAvailableClients', () => {
    return {
      getAvailableClients: mock(),
    }
  })

  mock.module('./utils/configManager', () => {
    return {
      addRoom: mock(),
      listRooms: mock([roomConfig]),
    }
  })

  mock.module('./utils/setInFocus', () => {
    return {
      setRoomInFocus: mock(),
    }
  })
})

describe('createAction', () => {
  it('creates a room', async () => {
    await createAction({ here: true })
    expect(getAvailableClients).toHaveBeenCalled()
    expect(constructAndLoadRoomWithNativeConnection).toHaveBeenCalled()
    expect(addRoom).toHaveBeenCalled()
    expect(setRoomInFocus).toHaveBeenCalled()
  })

  describe('when invalid options are provided', () => {
    it('no options returns undefined', async () => {
      expect(createAction({})).resolves.toBe(undefined)
    })
  })

  describe('when room already exists', () => {
    it('exits with error', async () => {
      const exitSpy = spyOn(process, 'exit').mockImplementation(() => {})
      await createAction({ address: 'demo-content-room' })
      expect(exitSpy).toHaveBeenCalledWith(1)
    })
  })
})
