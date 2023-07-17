import { Connection } from 'diograph-js'
import { initiateRoom } from '../testApp/app-data'
import { join } from 'path'

export const addRoom = async (roomAddress: string, contentClientType: string) => {
  const room = await initiateRoom(contentClientType, roomAddress)

  const connection = new Connection({
    address: join(roomAddress, 'Diory Content'),
    contentClientType,
  })
  room.addConnection(connection)

  await room.saveRoom()

  return room
}
