import { Connection } from '@diograph/diograph'
import { getClientAndVerify, initiateRoom } from '../testApp/app-data'

export const createRoom = async (roomAddress: string, contentClientType: string) => {
  const room = await initiateRoom(contentClientType, roomAddress)

  const nativeConnection = new Connection(
    await getClientAndVerify(
      contentClientType,
      `${
        roomAddress[roomAddress.length - 1] === '/'
          ? roomAddress.slice(0, roomAddress.length - 1)
          : roomAddress
      }/Diory Content`,
    ),
  )
  room.addConnection(nativeConnection)

  await room.saveRoom()

  return room
}
