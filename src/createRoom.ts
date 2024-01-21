import { Connection, ConnectionClient, Room, RoomClient } from '@diograph/diograph'
import { LocalClient } from '@diograph/local-client'
import { S3Client } from '@diograph/s3-client'

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

export const getClientAndVerify = async (
  clientType: string,
  address: string,
): Promise<ConnectionClient> => {
  console.log(`Verifying address for ${clientType}:`, address)
  let client: ConnectionClient
  if (clientType == 'LocalClient') {
    client = new LocalClient(address)
    await client.verify()
  } else if (clientType == 'S3Client') {
    client = new S3Client(address)
    await client.verify()
  } else {
    throw new Error(`getClientAndVerify: Unknown clientType: ${clientType}`)
  }

  return client
}

export const initiateRoom = async (contentClientType: string, address: string) => {
  const client = await getClientAndVerify(contentClientType, address)
  const roomClient = new RoomClient(client)
  const room = new Room(roomClient)
  return room
}
