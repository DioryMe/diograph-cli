import { Command } from 'commander'
import { ConfigClient, bootstrap } from '@diograph/diograph-server'
import { listRooms } from './utils/configManager.js'

const startAction = async () => {
  const configClient: ConfigClient = {
    getRoomConfigs: async () => {
      const roomConfigs = Object.values(await listRooms())
      return roomConfigs
    },
    getRoomConfig: async (roomId: string) => {
      const rooms = await listRooms()
      return rooms[roomId]
    },
  }
  bootstrap(configClient)
}

const startCommand = new Command('start').description('Start server').action(startAction)

const serverCommand = new Command('server').addCommand(startCommand)

export { serverCommand }
