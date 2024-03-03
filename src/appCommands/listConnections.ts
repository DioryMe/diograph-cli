import { Connection } from '@diograph/diograph'
import { listRooms } from '../configManager.js'
import { constructAndLoadRoom } from '@diograph/utils'
import { LocalClient } from '@diograph/local-client'

const outputListConnections = async (): Promise<void> => {
  const roomConfigs = await listRooms()
  const connections = await Promise.all(
    Object.values(roomConfigs).map(async (roomConfig) => {
      const room = await constructAndLoadRoom(roomConfig.address, roomConfig.roomClientType, {
        LocalClient: {
          clientConstructor: LocalClient,
        },
        // S3Client: {
        //   clientConstructor: S3Client,
        //   credentials: { region: 'eu-west-1', credentials },
        // },
      })
      return room.connections
    }),
  )
  console.log(generateOutput(connections.flat()))
}

// TODO: Generate table output with column headers
const generateOutput = (connections: Connection[]): string => {
  return connections
    .map((connection, i) => `${i}: ${connection.address} - ${connection.contentClientType}`)
    .join('\n')
}

export { outputListConnections }
