const getCommand = (commandName: string) => {
  const validCommands = ['diory', 'room', 'connection', 'content']

  if (!validCommands.includes(commandName)) {
    console.error(
      chalk.red(
        `Invalid command: ${commandName}. Command should be one of the following: 'diory', 'room', 'connection', 'content'.`,
      ),
    )
    process.exit(1)
  }

  switch (commandName) {
    case 'diory':
      // Handle 'diory' command
      break
    case 'room':
      // Handle 'room' command
      break
    case 'connection':
      // Handle 'connection' command
      break
    case 'content':
      // Handle 'content' command
      break
    default:
      break
  }
}

export { getCommand }
