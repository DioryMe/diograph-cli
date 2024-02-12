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
