import chalk from 'chalk'
import { generateDiory } from '@diograph/file-generator'

const importCommand = async (commandName: string, filePath: string) => {
  const validCommands = ['file', 'folder']

  if (!validCommands.includes(commandName)) {
    console.error(
      chalk.red(
        `Invalid command: ${commandName}. Command should be one of the following: 'file', 'folder'.`,
      ),
    )
    process.exit(1)
  }

  switch (commandName) {
    case 'file':
      const diory = await generateDiory('', filePath)
      console.log('Hello diory!', diory.toObject())
      break
    case 'folder':
      // Handle 'folder' command
      break
    default:
      break
  }
}

export { importCommand }
