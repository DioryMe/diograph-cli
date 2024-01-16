const importCommand = (commandName: string) => {
  const validCommands = ['file', 'folder']

  if (!validCommands.includes(commandName)) {
    console.error(
      `Invalid command: ${commandName}. Command should be one of the following: 'file', 'folder'.`,
    )
    process.exit(1)
  }

  switch (commandName) {
    case 'file':
      // Handle 'file' command
      break
    case 'folder':
      // Handle 'folder' command
      break
    default:
      break
  }
}

export { importCommand }
