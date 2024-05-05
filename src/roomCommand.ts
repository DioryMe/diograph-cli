import { program } from 'commander'
import { setRoomInFocus } from './appCommands/setInFocus.js'
import { addRoom, constructAndLoadRoom, listRooms } from './configManager.js'
import { createRoom } from './createRoom.js'
import chalk from 'chalk'
import { getAvailableClients } from './getAvailableClients.js'

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
    return
  }

  const contentClientType = options.clientType ?? 'LocalClient'
  const roomAddress = options.here || !options.address ? process.cwd() : options.address

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
    console.log(chalk.red('Please provide a room --address or --here'))
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
    process.exit(1)
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

const createRoomCommand = program
  .command('create')
  .option('--address <value>', 'Create room to given address')
  .option('--here', 'Create room to current directory')
  .option('--clientType <value>', 'Set clientType (default: LocalClient)')
  .action(createAction)

const addRoomCommand = program
  .command('add')
  .option('--address <value>', 'Add room from given address')
  .option('--here', 'Add room from current directory')
  .option('--clientType <value>', 'Set clientType (default: LocalClient)')
  .action(addAction)

const focusRoomCommand = program.command('focus <roomId>').action(focusAction)

export { createRoomCommand, addRoomCommand, focusRoomCommand }
