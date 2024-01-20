import { Connection, Room } from '@diograph/diograph'
import {
  setRoomInFocus as setRoomInConfig,
  setConnectionInFocus as setConnectionInConfig,
} from '../configManager.js'

export const setRoomInFocus = async (room: Room): Promise<void> => {
  if (!room.address) {
    throw new Error('Room address not defined')
  }
  await setRoomInConfig(room.address)

  if (room.connections.length) {
    await setConnectionInFocus(room.connections[0])
  }

  console.log(`Set room in focus: ${room.address}`)
}

export const setConnectionInFocus = async (connection: Connection) => {
  await setConnectionInConfig(connection.address)
  console.log(`Set connection in focus: ${connection.address}`)
}

// -------- ONLY BECAUSE test-app.ts ------------
import { saveAppData } from '../../testApp/app-data.js'
export const setRoomInFocus2 = async (rooms: Room[], roomIndex: number, appDataPath: string) => {
  const roomInFocus = rooms.length ? rooms[roomIndex] : null
  const connectionInFocus =
    roomInFocus && roomInFocus.connections.length ? roomInFocus.connections[0] : null
  await saveAppData(roomInFocus, connectionInFocus, rooms, appDataPath)

  console.log(`SUCCESS: Set room in focus: ${roomInFocus && roomInFocus.address}`)

  return { roomInFocus, connectionInFocus }
}
// -------- ONLY BECAUSE test-app.ts ------------
