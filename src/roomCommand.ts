import { setRoomInFocus } from './appCommands/setRoomInFocus.js'
import { addRoom, listRooms } from './configManager.js'
import { createRoom } from './createRoom.js'
import chalk from 'chalk'

const roomCommand = async (commandName: string, arg1: any, arg2: any) => {
  const validCommands = ['create', 'remove', 'delete', 'focus']

  if (!validCommands.includes(commandName)) {
    console.error(
      chalk.red(
        `Invalid command: ${commandName}. Command should be one of the following: 'create', 'remove', 'delete', 'focus'.`,
      ),
    )
    process.exit(1)
  }

  switch (commandName) {
    case 'create':
      await createRoomCommand(arg1, arg2)
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
    default:
      break
  }
}

const createRoomCommand = async (roomAddress: string, contentClientType: string) => {
  if (!roomAddress || !contentClientType) {
    console.error(
      chalk.red(
        `Invalid arguments: ${roomAddress}, ${contentClientType}. Arguments should be: roomAddress, contentClientType.`,
      ),
    )
    process.exit(1)
  }

  const roomList = await listRooms()

  if (
    Object.values(roomList)
      .map((r) => r.address)
      .find((existingRoomAddress) => existingRoomAddress === roomAddress)
  ) {
    console.error(chalk.red(`createRoom error: Room with address ${roomAddress} already exists`))
    process.exit(1)
  }

  try {
    const room = await createRoom(roomAddress, contentClientType)
    await addRoom(roomAddress, contentClientType)
    await setRoomInFocus(room)
  } catch (error) {
    console.error(chalk.red(`createRoom error: ${error}`))
    process.exit(1)
  }

  console.log('Room added.')
}

export { roomCommand }
