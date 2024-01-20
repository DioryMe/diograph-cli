import chalk from 'chalk'

const connectionCommand = (commandName: string) => {
  const validCommands = ['create', 'remove', 'delete', 'focus', 'listContents']

  if (!validCommands.includes(commandName)) {
    console.error(
      chalk.red(
        `Invalid command: ${commandName}. Command should be one of the following: 'create', 'remove', 'delete', 'focus', 'listContents'.`,
      ),
    )
    process.exit(1)
  }

  switch (commandName) {
    case 'create':
      // Handle 'create' command
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
    case 'listContents':
    default:
      break
  }
}

export { connectionCommand }
