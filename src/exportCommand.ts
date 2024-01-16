const exportCommand = (commandName: string) => {
  const validCommands = ['diory', 'diograph', 'content', 'room']

  if (!validCommands.includes(commandName)) {
    console.error(
      `Invalid command: ${commandName}. Command should be one of the following: 'diory', 'diograph', 'content', 'room'.`,
    )
    process.exit(1)
  }

  switch (commandName) {
    case 'diory':
      // Handle 'diory' command
      break
    case 'diograph':
      // Handle 'diograph' command
      break
    case 'content':
      // Handle 'content' command
      break
    case 'room':
      // Handle 'room' command
      break
    default:
      break
  }
}

export { exportCommand }
