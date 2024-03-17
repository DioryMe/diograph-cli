import chalk from 'chalk'

const exportCommand = (commandName: string) => {
  const validCommands = ['diory', 'diograph', 'content', 'room']

  if (!validCommands.includes(commandName)) {
    console.error(
      chalk.red(
        `Invalid command: ${commandName}. Command should be one of the following: 'diory', 'diograph', 'content', 'room'.`,
      ),
    )
    process.exit(1)
  }

  switch (commandName) {
    case 'diory':
      console.log('Not implemented yet')
      // Handle 'diory' command
      break
    case 'diograph':
      console.log('Not implemented yet')
      // Handle 'diograph' command
      break
    case 'content':
      console.log('Not implemented yet')
      // Handle 'content' command
      break
    case 'room':
      console.log('Not implemented yet')
      // Handle 'room' command
      break
    default:
      break
  }
}

export { exportCommand }
