import { Connection } from '@diograph/diograph'
import { LocalClient } from '@diograph/local-client'
import { constructRoom, getClientAndVerify } from '@diograph/utils'

export const createRoom = async (roomAddress: string, contentClientType: string) => {
  const room = await constructRoom(roomAddress, contentClientType, {
    LocalClient: {
      clientConstructor: LocalClient,
    },
    // S3Client: {
    //   clientConstructor: S3Client,
    //   credentials: { region: 'eu-west-1', credentials },
    // },
  })
  const nativeConnection = new Connection(
    await getClientAndVerify(
      `${
        roomAddress[roomAddress.length - 1] === '/'
          ? roomAddress.slice(0, roomAddress.length - 1)
          : roomAddress
      }/Diory Content`,
      contentClientType,
      {
        LocalClient: {
          clientConstructor: LocalClient,
        },
        // S3Client: {
        //   clientConstructor: S3Client,
        //   credentials: { region: 'eu-west-1', credentials },
        // },
      },
    ),
  )
  room.addConnection(nativeConnection)

  await room.saveRoom()

  return room
}
