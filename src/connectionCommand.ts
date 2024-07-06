import chalk from 'chalk'
import { Connection, Room } from '@diograph/diograph'
import {
  connectionInFocus,
  connectionInFocusAddress,
  roomInFocus,
  setConnectionInFocus,
} from './utils/configManager.js'
import { Command } from 'commander'
import { generateDiograph } from '@diograph/folder-generator'
import { getClientAndVerify } from '@diograph/diograph'
import { getAvailableClients } from './utils/getAvailableClients.js'
import { createAction as roomCreateAction } from './roomCommand.js'

const listContentsAction = async () => {
  const connectionAddress = await connectionInFocusAddress()
  const room = await roomInFocus()

  const connection = room.connections.find((connection) => connection.address == connectionAddress)
  if (!connection) {
    console.error(
      chalk.red(`Connection "${connectionAddress}" not found from room "${room.address}"`),
    )
    process.exitCode = 1
    return
  }

  let generateDiographReturnValue
  try {
    generateDiographReturnValue = await generateDiograph(connectionAddress)
  } catch (error: any) {
    if (/^FFMPEG_PATH not defined/.test(error.message)) {
      console.error(
        chalk.red(
          `Folder includes a video file which requires FFMPEG for diory generation. \nPlease use \`dcli config set FFMPEG_PATH [path to ffmpeg]\` to set it.`,
        ),
      )
      process.exitCode = 1
      return
    }
    console.log(error.message)
    throw error
  }

  const connectionDiograph = generateDiographReturnValue.diograph
  const cidMapping = generateDiographReturnValue.paths

  connection.diograph.initialise(connectionDiograph.toObject())
  Object.values(connection.diograph.diograph).forEach((diory) => {
    if (diory.data && diory.data[0].contentUrl) {
      connection.addContentUrl(diory.data[0].contentUrl, diory.id)
    }
  })

  Object.entries(cidMapping).forEach(([id, path]) => {
    connection.contentUrls[id] = path
  })

  await room.saveRoom()
}

interface createActionOptions {
  contentClientType: string
  address?: string
  here?: boolean
}

const createAction = async (options: createActionOptions) => {
  if (Object.keys(options).length === 0) {
    console.log(chalk.red('Please provide a connection --address or --here'))
    process.exitCode = 1
    return
  }

  const contentClientType = options.contentClientType ?? 'LocalClient'
  const connectionAddress = options.here || !options.address ? process.cwd() : options.address

  let room: Room
  try {
    room = await roomInFocus()
  } catch (error) {
    console.error(chalk.red(`createConnection failed: ${error}`))
    process.exitCode = 1
    return
  }

  if (room.connections.find((connection) => connectionAddress == connection.address)) {
    console.error(
      chalk.red(
        `createConnection error: Connection with address ${connectionAddress} already exists`,
      ),
    )
    process.exitCode = 1
    return
  }

  const connection = await createConnectionToRoom(room, connectionAddress, contentClientType)
  await setConnectionInFocus(connection.address)

  return
}

const createConnectionToRoom = async (room: Room, address: string, contentClientType: string) => {
  const availableClients = await getAvailableClients()
  const connectionClient = await getClientAndVerify(address, contentClientType, availableClients)
  const connection = new Connection(connectionClient)
  room.addConnection(connection)
  await room.saveRoom()

  return connection
}

interface ExportActionOptions {
  address?: string
  here?: boolean
}

const exportAction = async (options: ExportActionOptions) => {
  if (Object.keys(options).length === 0) {
    console.log(chalk.red('Please provide a path for exported connection: --address or --here'))
    process.exitCode = 1
    return
  }

  const exportAddress = options.here || !options.address ? process.cwd() : options.address

  const connection = await connectionInFocus()
  await roomCreateAction(options)
  const room = await roomInFocus()
  room.diograph.initialise(connection.diograph.toObject())
  connection.diograph.resetDiograph()
  room.addConnection(connection)
  room.saveRoom()
}

const createConnectionCommand = new Command('create')
  .option('--clientType', 'Set connection client type (default: LocalClient)')
  .option('--address <value>', 'Create connection to given address')
  .option('--here', 'Create connection in current directory')
  .action(createAction)

const listContentsConnectionCommand = new Command('list-contents').action(listContentsAction)

const exportConnectionCommand = new Command('export')
  .description('Export connection as room')
  .option('--address <value>', 'Address where to export connection')
  .option('--here', 'Export connection to current directory')
  .action(exportAction)

const connectionCommand = new Command('connection')
  .description('Manage connections')
  .addCommand(createConnectionCommand)
  .addCommand(listContentsConnectionCommand)
  .addCommand(exportConnectionCommand)
// .option('remove', 'Remove a connection')
// .option('delete', 'Delete a connection')
// NOTE: Focus needs the whole Connection object (no id or address)
// - will be deprecated as connections are turned into rooms
// .option('focus', 'Focus on a connection')

export { connectionCommand }
