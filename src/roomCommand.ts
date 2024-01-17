import { createRoom } from './createRoom'

const roomCommand = async (commandName: string, arg1: any, arg2: any) => {
  const validCommands = ['create', 'remove', 'delete', 'focus']

  if (!validCommands.includes(commandName)) {
    console.error(
      `Invalid command: ${commandName}. Command should be one of the following: 'create', 'remove', 'delete', 'focus'.`,
    )
    process.exit(1)
  }

  switch (commandName) {
    case 'create':
      if (!arg1 || !arg2) {
        console.error(
          `Invalid arguments: ${arg1}, ${arg2}. Arguments should be: roomAddress, contentClientType.`,
        )
        process.exit(1)
      }
      await createRoom(arg1, arg2)
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
