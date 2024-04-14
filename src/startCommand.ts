import { program } from 'commander'
import { ConfigClient, RoomConfig, bootstrap } from 'diograph-server'

const startAction = async () => {
  const configClient: ConfigClient = {
    getRoomConfig: async (roomId: string) => {
      const rooms: { [roomId: string]: RoomConfig } = {
        'room-1': {
          address: '/Users/Jouni/Code/demo-content-room',
          clientType: 'LocalClient',
        },
        'room-2': {
          address: '/tmp/demo-content/room-1',
          clientType: 'LocalClient',
        },
        'room-3': {
          address: 'jvalanen-diory-test3/room',
          clientType: 'S3Client',
        },
      }
      return rooms[roomId]
    },
  }
  bootstrap(configClient)
}

const startCommand = program.command('start').description('Start server').action(startAction)

export { startCommand }
