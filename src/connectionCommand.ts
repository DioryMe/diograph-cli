import chalk from 'chalk'
import { Connection, Room } from '@diograph/diograph'
import { getClientAndVerify } from './createRoom.js'
import { roomInFocus, setConnectionInFocus } from './configManager.js'
import { program } from 'commander'

const listContentsAction = async () => {
  // connection.diograph.addDiograph(list)
  // connection.diograph.diories().forEach((diory) => {
  //   if (diory.data && diory.data[0].contentUrl) {
  //     connection.addContentUrl(diory.data[0].contentUrl, diory.id)
  //   }
  // })
  // await this.roomInFocus.saveRoom()
}

interface createActionOptions {
  contentClientType: string
}

const createAction = async (
  connectionAddress: string = process.cwd(),
  options: createActionOptions,
) => {
  const contentClientType = options.contentClientType || 'LocalClient'
  let room: Room
  try {
    room = await roomInFocus()
  } catch (error) {
    console.error(chalk.red(`createConnection failed: ${error}`))
    process.exit(1)
  }

  if (room.connections.find((connection) => connectionAddress == connection.address)) {
    console.error(
      chalk.red(
        `createConnection error: Connection with address ${connectionAddress} already exists`,
      ),
    )
    process.exit(1)
  }

  const connection = await createConnectionToRoom(room, connectionAddress, contentClientType)
  await setConnectionInFocus(connection.address)

  return
}

export const createConnectionToRoom = async (
  room: Room,
  address: string,
  contentClientType: string,
) => {
  const connectionClient = await getClientAndVerify(contentClientType, address)
  const connection = new Connection(connectionClient)
  room.addConnection(connection)
  await room.saveRoom()

  return connection
}

const createConnectionCommand = program
  .command('create <address>')
  .option('--clientType', 'Set connection client type (default: LocalClient)')
  // .option('--here', 'Create connection in current folder')
  .action(createAction)

const listContentsConnectionCommand = program.command('list-contents').action(listContentsAction)

export { createConnectionCommand, listContentsConnectionCommand }
