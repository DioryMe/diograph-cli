import { program } from 'commander'
import { setRoomInFocus } from './appCommands/setInFocus.js'
import { addRoom, constructAndLoadRoom, getS3Credentials, listRooms } from './configManager.js'
import { createRoom } from './createRoom.js'
import chalk from 'chalk'
import { LocalClient } from '@diograph/local-client'
import { S3Client } from '@diograph/s3-client'
// TODO: Fix to '@diograph/diograph/types' (works in S3Client, at least ConnectionClient)
import { ConnectionClientList } from '@diograph/diograph/types.js'

const getAvailableClients = async (): Promise<ConnectionClientList> => {
  const credentials = await getS3Credentials()

  return {
    LocalClient: {
      clientConstructor: LocalClient,
    },
    S3Client: {
      clientConstructor: S3Client,
      credentials: { region: 'eu-west-1', credentials },
    },
  }
}

const exitIfRoomAlreadyExists = async (roomAddress: string, method?: string) => {
  const roomList = await listRooms()

  if (
    Object.values(roomList)
      .map((r) => r.address)
      .find((existingRoomAddress) => existingRoomAddress === roomAddress)
  ) {
    console.error(chalk.red(`${method} error: Room with address ${roomAddress} already exists`))
    process.exit(1)
  }
}

interface createActionOptions {
  path?: string
  here?: boolean
  clientType?: string
}

const createAction = async (options: createActionOptions) => {
  if (Object.keys(options).length === 0) {
    console.log(chalk.red('Please provide a room address or --here'))
    return
  }

  const contentClientType = options.clientType ?? 'LocalClient'
  const roomAddress = options.here || !options.path ? process.cwd() : options.path

  await exitIfRoomAlreadyExists(roomAddress, 'createRoom')

  try {
    const availableClients = await getAvailableClients()
    const room = await createRoom(roomAddress, contentClientType, availableClients)
    await addRoom(roomAddress, contentClientType)
    await setRoomInFocus(room)
  } catch (error) {
    console.error(chalk.red(`createRoom error: ${error}`))
    process.exit(1)
  }

  console.log('Room created.')
}

const addAction = async (options: createActionOptions) => {
  if (Object.keys(options).length === 0) {
    console.log(chalk.red('Please provide a room address or --here'))
    return
  }

  const contentClientType = options.clientType ?? 'LocalClient'
  const roomAddress = options.here || !options.path ? process.cwd() : options.path

  await exitIfRoomAlreadyExists(roomAddress, 'addRoom')

  try {
    const availableClients = await getAvailableClients()
    const room = await constructAndLoadRoom(roomAddress, contentClientType, availableClients)
    await addRoom(roomAddress, contentClientType)
    await setRoomInFocus(room)
  } catch (error) {
    console.error(chalk.red(`addRoom error: ${error}`))
    process.exit(1)
  }

  console.log('Room added.')
}

const createRoomCommand = program
  .command('create')
  .option('--path <value>', 'Create room to given path')
  .option('--here', 'Create room to current directory')
  .option('--clientType <value>', 'Set clientType (default: LocalClient)')
  .action(createAction)

const addRoomCommand = program
  .command('add')
  .option('--path <value>', 'Add room from given path')
  .option('--here', 'Add room from current directory')
  .option('--clientType <value>', 'Set clientType (default: LocalClient)')
  .action(addAction)

export { createRoomCommand, addRoomCommand }
