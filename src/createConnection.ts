import { Connection, Room } from '@diograph/diograph'
import { LocalClient } from '@diograph/local-client'
import { getClientAndVerify } from '../testApp/app-data'

export const createConnection = async (room: Room, address: string, contentClientType: string) => {
  const connection = new Connection(await getClientAndVerify(contentClientType, address))
  room.addConnection(connection)
  await room.saveRoom()

  return connection
}
