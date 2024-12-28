import { Command } from 'commander'
import { setRoomInFocus } from './utils/setInFocus.js'
import { addRoom, listRooms, removeRoom } from './utils/configManager.js'
import chalk from 'chalk'
import { getAvailableClients } from './utils/getAvailableClients.js'
import {
  constructAndLoadRoom,
  constructAndLoadRoomWithNativeConnection,
  getClientAndVerify,
} from '@diograph/diograph'
import { ConnectionClientList } from '@diograph/diograph/types'
import * as readline from 'readline'

const confirmContinue = (question: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (input: string) => {
      const userInput = input.trim().toLowerCase()

      if (userInput === 'y') {
        rl.close()
        resolve(true)
        return
      }
      rl.close()
      process.exit(0)
    })
  })
}

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

  if (Object.values(roomList).find((roomConfig) => roomConfig.address === roomAddress)) {
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
  // - not automatically created as otherwise we couldn't know if creating it would happen on purpose
  // - needs to be done with client but ConnectionClient interface doesn't have proper methods
  // - need extending with e.g. "createAddressForFolder" (+ implementing it to each client)
  // - prompting "Are your sure to add new folder?" on each command using it
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

interface removeActionOptions {
  roomId?: string
  address?: string
  yes?: boolean
}

const removeAction = async (options: removeActionOptions) => {
  if (Object.keys(options).length === 0) {
    console.log(chalk.red('Please provide a room --address or --id'))
    process.exitCode = 1
    return
  }

  const roomList = await listRooms()

  const roomConfig = options.roomId
    ? roomList[options.roomId]
    : Object.values(roomList).find((roomConfig) => roomConfig.address === options.address)

  if (!roomConfig || !(roomConfig && roomConfig.id)) {
    console.error(chalk.red(`removeAction error: Room with address ${options.address} not found`))
    process.exitCode = 1
    return
  }
  const roomAddress = roomConfig.address
  if (!options.yes) {
    await confirmContinue(`Are you sure you want to remove room in ${roomAddress}?`)
  }

  await removeRoom(roomConfig.id)
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

interface destroyActionOptions {
  roomId?: string
  address?: string
  destroyConnections: boolean
  yes?: boolean
}

// TODO: Should indicate destroying the connections!
// - --dry-run option to show what would be destroyed
// - it's ok to destroy native connection
// - but maybe destroying other connection folders is very dangerous
const destroyAction = async (options: destroyActionOptions) => {
  if (Object.keys(options).length === 0) {
    console.log(chalk.red('Please provide a room --address or --id'))
    process.exitCode = 1
    return
  }

  const roomList = await listRooms()

  const roomConfig = options.roomId
    ? roomList[options.roomId]
    : Object.values(roomList).find((roomConfig) => roomConfig.address === options.address)

  if (!roomConfig || !(roomConfig && roomConfig.id)) {
    console.error(
      chalk.red(
        `destroyRoom error: Room with address '${options.address}' or id '${options.roomId}' not found`,
      ),
    )
    process.exitCode = 1
    return
  }
  if (!options.yes) {
    await confirmContinue(`Are you sure you want to destroy room in ${roomConfig.address}?`)
  }
  const availableClients = await getAvailableClients()
  const room = await constructAndLoadRoom(
    roomConfig.address,
    roomConfig.clientType,
    availableClients,
  )

  try {
    if (options.destroyConnections) {
      await Promise.all(
        room.connections.map(async (connection) => {
          console.log('Destroying connection: ', connection.address)
          // connection.deleteConnection()
        }),
      )
    }
    console.log('Destroying room: ', room.address)
    // await room.deleteRoom()
    // await removeRoom(roomConfig.id)
  } catch (error) {
    console.error(chalk.red(`destroyRoom error: ${error}`))
    process.exitCode = 1
    return
  }
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

const removeRoomCommand = new Command('remove') //
  .option('--address <value>', 'Destroy room from given address')
  .option('--roomId <value>', 'Destroy room from given id')
  .option('--yes', 'Confirm removal without asking')
  .action(removeAction)

const focusRoomCommand = new Command('focus') //
  .arguments('<roomId>')
  .action(focusAction)

const destroyRoomCommand = new Command('destroy') //
  .option('--address <value>', 'Destroy room from given address')
  .option('--roomId <value>', 'Destroy room from given id')
  .option('--yes', 'Confirm removal without asking')
  .option('--destroyConnections', 'Destroy also connection folders')
  .action(destroyAction)

const roomCommand = new Command('room')
  .description('Manage rooms')
  .addCommand(createRoomCommand)
  .addCommand(addRoomCommand)
  .addCommand(removeRoomCommand)
  .addCommand(focusRoomCommand)
  .addCommand(destroyRoomCommand)

export { roomCommand, createAction }
