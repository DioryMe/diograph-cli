import { Connection, Room } from '@diograph/diograph'
import { getClientAndVerify } from '../testApp/app-data.js'

export const createConnection = async (room: Room, address: string, contentClientType: string) => {
  const connection = new Connection(await getClientAndVerify(contentClientType, address))
  room.addConnection(connection)
  await room.saveRoom()

  return connection
}
