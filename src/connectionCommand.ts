import chalk from 'chalk'
import { Connection, Room } from '@diograph/diograph'
import { connectionInFocusAddress, roomInFocus, setConnectionInFocus } from './configManager.js'
import { Command } from 'commander'
// import { generateDiograph } from '@diograph/folder-generator'
import { getClientAndVerify } from '@diograph/utils'
import { getAvailableClients } from './getAvailableClients.js'

/*
const listContentsAction = async () => {
  const connectionAddress = await connectionInFocusAddress()
  const room = await roomInFocus()

  const connection = room.connections.find((connection) => connection.address == connectionAddress)
  if (!connection) {
    console.error(
      chalk.red(`Connection "${connectionAddress}" not found from room "${room.address}"`),
    )
    process.exit(1)
  }

  let connectionDiograph
  try {
    connectionDiograph = await generateDiograph(connectionAddress)
  } catch (error: any) {
    if (/^FFMPEG_PATH not defined/.test(error.message)) {
      console.error(
        chalk.red(
          `Folder includes a video file which requires FFMPEG for diory generation. \nPlease use \`dcli config set FFMPEG_PATH [path to ffmpeg]\` to set it.`,
        ),
      )
      return
    }
    console.log(error.message)
    throw error
  }

  connection.diograph.addDiograph(connectionDiograph.toObject())
  connection.diograph.diories().forEach((diory) => {
    if (diory.data && diory.data[0].contentUrl) {
      connection.addContentUrl(diory.data[0].contentUrl, diory.id)
    }
  })

  await room.saveRoom()
}
*/

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
  const availableClients = await getAvailableClients()
  const connectionClient = await getClientAndVerify(address, contentClientType, availableClients)
  const connection = new Connection(connectionClient)
  room.addConnection(connection)
  await room.saveRoom()

  return connection
}

const createConnectionCommand = new Command('create')
  .arguments('<address>')
  .option('--clientType', 'Set connection client type (default: LocalClient)')
  // .option('--here', 'Create connection in current folder')
  .action(createAction)

// const listContentsConnectionCommand = program.command('list-contents').action(listContentsAction)

const connectionCommand = new Command('connection')
  .description('Manage connections')
  .addCommand(createConnectionCommand)
// .addCommand(listContentsConnectionCommand)
// .option('remove', 'Remove a connection')
// .option('delete', 'Delete a connection')
// .option('focus', 'Focus on a connection')

export { connectionCommand }
