import chalk from 'chalk'
import { Connection, Room } from '@diograph/diograph'
import { getClientAndVerify } from './createRoom.js'

const connectionCommand = (commandName: string, arg1: any, arg2: any) => {
  const validCommands = ['create', 'remove', 'delete', 'focus', 'listContents']

  if (!validCommands.includes(commandName)) {
    console.error(
      chalk.red(
        `Invalid command: ${commandName}. Command should be one of the following: 'create', 'remove', 'delete', 'focus', 'listContents'.`,
      ),
    )
    process.exit(1)
  }

  switch (commandName) {
    case 'create':
      createConnectionCommand(arg1, arg2)
      break
    case 'remove':
      // Handle 'remove' command
      break
    case 'delete':
      // Handle 'delete' command
      break
    case 'focus':
      // Handle 'focus' command
      break
    case 'listContents':
    default:
      break
  }
}

const createConnectionCommand = async (
  connectionAddress: string = process.cwd(),
  contentClientType: string = 'LocalClient',
) => {
  // QUESTION: How to get Room object for roomInFocus?

  // roomInFocusId()

  // if (roomInFocus.connections.find((connection) => connectionAddress == connection.address)) {
  //   console.error(chalk.red(`createRoom error: Room with address ${roomAddress} already exists`))
  //   process.exit(1)
  // }

  // const connection = await createConnection(roomInFocus, connectionAddress, contentClientType)
  // await addConnection(connectionAddress, contentClientType)
  // await setConnectionInFocus(connection)

  return
}

export const createConnection = async (room: Room, address: string, contentClientType: string) => {
  const connectionClient = await getClientAndVerify(address, contentClientType)
  const connection = new Connection(connectionClient)
  room.addConnection(connection)
  await room.saveRoom()

  return connection
}

export { connectionCommand }
