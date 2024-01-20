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
      try {
        await createRoom(arg1, arg2)
      } catch (error) {
        console.error(chalk.red(`createRoom error: ${error}`))
        break
      }

      // if (this.rooms.find((existingRoom) => existingRoom.address === roomPath)) {
      //   throw new Error(`createRoom error: Room with address ${roomPath} already exists`)
      // }

      // Add room to app
      // this.rooms.push(room)

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
