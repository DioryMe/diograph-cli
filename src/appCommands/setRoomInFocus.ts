import { Room } from '@diograph/diograph'
import { saveAppData } from '../../testApp/app-data'

export const setRoomInFocus = async (rooms: Room[], roomIndex: number, appDataPath: string) => {
  const roomInFocus = rooms.length ? rooms[roomIndex] : null
  const connectionInFocus =
    roomInFocus && roomInFocus.connections.length ? roomInFocus.connections[0] : null
  await saveAppData(roomInFocus, connectionInFocus, rooms, appDataPath)

  console.log(`SUCCESS: Set room in focus: ${roomInFocus && roomInFocus.address}`)
}
