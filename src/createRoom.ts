import { Connection, Room } from '@diograph/diograph'
import { ConnectionClientList } from '@diograph/diograph/types.js'
import { constructRoom, getClientAndVerify } from '@diograph/utils'

export const createRoom = async (
  roomAddress: string,
  contentClientType: string,
  availableClients: ConnectionClientList,
): Promise<Room> => {
  const room = await constructRoom(roomAddress, contentClientType, availableClients)
  const nativeConnection = new Connection(
    await getClientAndVerify(
      `${
        roomAddress[roomAddress.length - 1] === '/'
          ? roomAddress.slice(0, roomAddress.length - 1)
          : roomAddress
      }/Diory Content`,
      contentClientType,
      availableClients,
    ),
  )
  room.addConnection(nativeConnection)

  await room.saveRoom()

  return room
}
