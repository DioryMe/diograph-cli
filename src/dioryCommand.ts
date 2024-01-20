import chalk from 'chalk'

const dioryCommand = (commandName: string) => {
  const validCommands = ['create', 'delete', 'link', 'focus']

  if (!validCommands.includes(commandName)) {
    console.error(
      chalk.red(
        `Invalid command: ${commandName}. Command should be one of the following: 'create', 'delete', 'link', 'focus'.`,
      ),
    )
    process.exit(1)
  }

  switch (commandName) {
    case 'create':
      // Handle 'create' command
      break
    case 'delete':
      // Handle 'delete' command
      break
    case 'link':
      // Handle 'link' command
      break
    case 'focus':
      // Handle 'focus' command
      break
    default:
      break
  }
}

export { dioryCommand }
