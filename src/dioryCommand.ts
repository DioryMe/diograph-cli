import chalk from 'chalk'
import { roomInFocus } from './configManager.js'

const dioryCommand = async (commandName: string) => {
  const validCommands = ['create', 'delete', 'link', 'focus', 'query', 'show']

  if (!validCommands.includes(commandName)) {
    console.error(
      chalk.red(
        `Invalid command: ${commandName}. Command should be one of the following: 'create', 'delete', 'link', 'focus', 'query', 'show'.`,
      ),
    )
    process.exit(1)
  }

  const room = await roomInFocus()
  const diograph = room.diograph

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
    case 'query':
      const searchResult = diograph.queryDiograph({ text: 'super' })
      console.log('searchResult', Object.keys(searchResult.toObject()))
      break
    case 'show':
      const diory = diograph.getDiory({
        id: 'bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona',
      })
      console.log('diory', diory.toObjectWithoutImage())
    default:
      break
  }
}

export { dioryCommand }
