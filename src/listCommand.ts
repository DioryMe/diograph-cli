import { Command } from 'commander'
import { Connection } from '@diograph/diograph'
import { listRooms } from './utils/configManager.js'
import { constructAndLoadRoom } from '@diograph/utils'
import { getAvailableClients } from './utils/getAvailableClients.js'

const listRoomsAction = async () => {
  const rooms = await listRooms()
  console.log(generateRoomListOutput(rooms))
}

const generateRoomListOutput = (rooms: object): string => {
  return Object.values(rooms)
    .map((room, i) => `${room.id}: ${room.address} - ${room.clientType}`)
    .join('\n')
}

const listConnectionsAction = async () => {
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
  console.log(generateConnectionListOutput(connections.flat()))
}

const generateConnectionListOutput = (connections: Connection[]): string => {
  return connections
    .map((connection, i) => `${i}: ${connection.address} - ${connection.contentClientType}`)
    .join('\n')
}

const listRoomsCommand = new Command('rooms').action(listRoomsAction)
const listConnectionsCommand = new Command('connections').action(listConnectionsAction)

const listCommand = new Command('list')
  .description('List rooms and connections')
  .addCommand(listRoomsCommand)
  .addCommand(listConnectionsCommand)

export { listCommand }
