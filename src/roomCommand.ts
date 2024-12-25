import { Command } from 'commander'
import { setRoomInFocus } from './utils/setInFocus.js'
import { addRoom, listRooms } from './utils/configManager.js'
import chalk from 'chalk'
import { getAvailableClients } from './utils/getAvailableClients.js'
import {
  constructAndLoadRoom,
  constructAndLoadRoomWithNativeConnection,
  getClientAndVerify,
} from '@diograph/diograph'
import { ConnectionClientList } from '@diograph/diograph/types'

const exitIfAddressNotExists = async (
  address: string,
  contentClientType: string,
  availableClients: ConnectionClientList,
  method: string,
) => {
  try {
    await getClientAndVerify(address, contentClientType, availableClients)
    return true
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      chalk.red(
        `${method} error: address ${address} doesn't exist, please create it before continuing`,
      ),
    )
    process.exit(1)
  }
}

const getNativeConnectionAddress = (roomAddress: string) => {
  return `${
    roomAddress[roomAddress.length - 1] === '/'
      ? roomAddress.slice(0, roomAddress.length - 1)
      : roomAddress
  }/Diory Content`
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
  address?: string
  here?: boolean
  clientType?: string
}

const createAction = async (options: createActionOptions) => {
  if (Object.keys(options).length === 0) {
    console.log(chalk.red('Please provide a room --address or --here'))
    process.exitCode = 1
    return
  }

  const contentClientType = options.clientType ?? 'LocalClient'
  const roomAddress = options.here || !options.address ? process.cwd() : options.address

  // Check if addresses exist
  // TODO: Prompt user to create address if it doesn't exist
  // - needs to be done with client but client is not available here and doesn't have proper methods
  const availableClients = await getAvailableClients()
  await exitIfAddressNotExists(roomAddress, contentClientType, availableClients, 'createRoom')
  await exitIfAddressNotExists(
    getNativeConnectionAddress(roomAddress),
    contentClientType,
    availableClients,
    'createRoom',
  )
  // Check if room already added to dcli
  await exitIfRoomAlreadyExists(roomAddress, 'createRoom')

  try {
    const room = await constructAndLoadRoomWithNativeConnection(
      roomAddress,
      contentClientType,
      availableClients,
    )
    await room.saveRoom()
    await addRoom(roomAddress, contentClientType)
    await setRoomInFocus(room)
  } catch (error) {
    console.error(chalk.red(`createRoom error: ${error}`))
    process.exitCode = 1
    return
  }

  console.log('Room created.')
}

const addAction = async (options: createActionOptions) => {
  if (Object.keys(options).length === 0) {
    console.log(chalk.red('Please provide a room --address or --here'))
    process.exitCode = 1
    return
  }

  const contentClientType = options.clientType ?? 'LocalClient'
  const roomAddress = options.here || !options.address ? process.cwd() : options.address

  await exitIfRoomAlreadyExists(roomAddress, 'addRoom')

  try {
    const availableClients = await getAvailableClients()
    const room = await constructAndLoadRoom(roomAddress, contentClientType, availableClients)
    await addRoom(roomAddress, contentClientType)
    await setRoomInFocus(room)
  } catch (error) {
    console.error(chalk.red(`addRoom error: ${error}`))
    process.exitCode = 1
    return
  }

  console.log(chalk.green('Room added.'))
}

const focusAction = async (roomId: string) => {
  const roomConfig = (await listRooms())[roomId]

  const availableClients = await getAvailableClients()
  const room = await constructAndLoadRoom(
    roomConfig.address,
    roomConfig.clientType,
    availableClients,
  )
  await setRoomInFocus(room)

  console.log(chalk.green('Room added.'))
}

const createRoomCommand = new Command('create')
  .option('--address <value>', 'Create room to given address')
  .option('--here', 'Create room to current directory')
  .option('--clientType <value>', 'Set clientType (default: LocalClient)')
  .action(createAction)

const addRoomCommand = new Command('add')
  .option('--address <value>', 'Add room from given address')
  .option('--here', 'Add room from current directory')
  .option('--clientType <value>', 'Set clientType (default: LocalClient)')
  .action(addAction)

const focusRoomCommand = new Command('focus') //
  .arguments('<roomId>')
  .action(focusAction)

const roomCommand = new Command('room')
  .description('Manage rooms')
  .addCommand(createRoomCommand)
  .addCommand(addRoomCommand)
  .addCommand(focusRoomCommand)
// .option('remove', 'Remove a room (arg1: roomAddress)')
// .option('delete', 'Delete a room (arg1: roomAddress)')

export { roomCommand, createAction }
