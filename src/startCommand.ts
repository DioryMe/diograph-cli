import { program } from 'commander'
import { ConfigClient, RoomConfig, bootstrap } from 'diograph-server'
import { listRooms } from './configManager.js'

const startAction = async () => {
  const configClient: ConfigClient = {
    getRoomConfig: async (roomId: string) => {
      const rooms = await listRooms()
      return rooms[roomId]
    },
  }
  bootstrap(configClient)
}

const startCommand = program.command('start').description('Start server').action(startAction)

export { startCommand }
