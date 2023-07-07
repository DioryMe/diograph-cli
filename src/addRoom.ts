import { Connection } from 'diograph-js'
import { initiateRoom } from '../testApp/app-data'
import { join } from 'path'

export const addRoom = async (roomPath: string, contentClientType: string) => {
  const room = await initiateRoom(contentClientType, roomPath)

  const connection = new Connection({
    address: join(roomPath, 'Diory Content'),
    contentClientType,
  })
  room.addConnection(connection)

  await room.saveRoom()

  return room
}
