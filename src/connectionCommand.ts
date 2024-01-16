const connectionCommand = (commandName: string) => {
  const validCommands = ['create', 'remove', 'delete', 'focus']

  if (!validCommands.includes(commandName)) {
    console.error(
      `Invalid command: ${commandName}. Command should be one of the following: 'create', 'remove', 'delete', 'focus'.`,
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
    default:
      break
  }
}

export { connectionCommand }
