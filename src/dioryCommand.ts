import chalk from 'chalk'
import { roomInFocus } from './configManager.js'
import { program } from 'commander'

interface queryActionOptions {
  text?: string
  all?: boolean
}

const queryAction = async (options: queryActionOptions) => {
  if (Object.keys(options).length === 0) {
    console.log(chalk.red('Please provide an option or --all'))
    return
  }

  if (options.all) {
    options = {}
  }

  const room = await roomInFocus()
  const diograph = room.diograph

  const searchResult = diograph.queryDiograph(options)
  console.log('searchResult', Object.keys(searchResult.toObject()))
}

const showAction = async (dioryId: string) => {
  const room = await roomInFocus()
  const diograph = room.diograph

  try {
    const diory = diograph.getDiory({
      id: dioryId,
    })
    console.log('diory', diory.toObjectWithoutImage())
  } catch (error: any) {
    console.log(chalk.red(error.message))
  }
}

const dioryQueryCommand = program
  .command('query')
  .option('--text <value>', 'Query from text field')
  .option('--all', 'List all')
  .action(queryAction)
const dioryShowCommand = program.command('show <diory-id>').action(showAction)

export { dioryShowCommand, dioryQueryCommand }
