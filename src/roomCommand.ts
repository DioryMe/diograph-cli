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
      if (!arg1 || !arg2) {
        console.error(
          chalk.red(
            `Invalid arguments: ${arg1}, ${arg2}. Arguments should be: roomAddress, contentClientType.`,
          ),
        )
        process.exit(1)
      }

      const roomAddress = arg1
      const contentClientType = arg2

      if (
        Object.values(await listRooms())
          .map((r) => r.address)
          .find((existingRoomAddress) => existingRoomAddress === roomAddress)
      ) {
        console.error(
          chalk.red(`createRoom error: Room with address ${roomAddress} already exists`),
        )
        process.exit(1)
      }

      try {
        await createRoom(roomAddress, contentClientType)
      } catch (error) {
        console.error(chalk.red(`createRoom error: ${error}`))
        process.exit(1)
      }

      await addRoom(roomAddress, contentClientType)

      // // Set room in focus
      // const { roomInFocus, connectionInFocus } = await setRoomInFocus(
      //   this.rooms,
      //   this.rooms.length - 1,
      //   APP_DATA_PATH,
      // )
      // this.roomInFocus = roomInFocus
      // this.connectionInFocus = connectionInFocus

      console.log('Room added.')
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

export { roomCommand }
