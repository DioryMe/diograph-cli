import { Room } from '@diograph/diograph'
import { saveAppData } from '../../testApp/app-data'

export const setConnectionInFocus = async (
  connectionIndex: number,
  roomInFocus: Room,
  rooms: Room[],
  appDataPath: string,
) => {
  const connectionInFocus = roomInFocus.connections.length
    ? roomInFocus.connections[connectionIndex]
    : null
  await saveAppData(roomInFocus, connectionInFocus, rooms, appDataPath)

  console.log(`SUCCESS: Set connection in focus: ${connectionInFocus && connectionInFocus.address}`)

  return connectionInFocus
}
