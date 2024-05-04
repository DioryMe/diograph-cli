import { Connection } from '@diograph/diograph'
import { listRooms } from '../configManager.js'
import { constructAndLoadRoom } from '@diograph/utils'
import { getAvailableClients } from '../getAvailableClients.js'

const outputListConnections = async (): Promise<void> => {
  const roomConfigs = await listRooms()
  const availableClients = await getAvailableClients()
  const connections = await Promise.all(
    Object.values(roomConfigs).map(async (roomConfig) => {
      const room = await constructAndLoadRoom(
        roomConfig.address,
        roomConfig.clientType,
        availableClients,
      )
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
