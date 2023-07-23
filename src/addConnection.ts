import { Connection, Room } from '@diograph/diograph'

export const addConnection = async (room: Room, address: string, contentClientType: string) => {
  const connection = new Connection({
    address,
    contentClientType,
  })
  room.addConnection(connection)
  await room.saveRoom()

  return connection
}
