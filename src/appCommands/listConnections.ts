import { Connection } from '@diograph/diograph/index.js'
import { constructAndLoadRoom, listRooms } from '../configManager.js'

const outputListConnections = async (): Promise<void> => {
  const roomConfigs = await listRooms()
  const connections = await Promise.all(
    Object.values(roomConfigs).map(async (roomConfig) => {
      const room = await constructAndLoadRoom(roomConfig.address, roomConfig.roomClientType)
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
