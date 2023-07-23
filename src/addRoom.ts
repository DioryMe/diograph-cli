import { Connection } from '@diograph/diograph'
import { initiateRoom } from '../testApp/app-data'

export const addRoom = async (roomAddress: string, contentClientType: string) => {
  const room = await initiateRoom(contentClientType, roomAddress)

  if (roomAddress[roomAddress.length - 1] == '/') {
    throw new Error('roomAddress MUST NOT end with /')
  }
  const nativeConnection = new Connection({
    address: `${roomAddress}/Diory Content`,
    contentClientType,
  })
  room.addConnection(nativeConnection)

  await room.saveRoom()

  return room
}
