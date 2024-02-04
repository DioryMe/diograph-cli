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

const showAction = async () => {
  const room = await roomInFocus()
  const diograph = room.diograph

  const diory = diograph.getDiory({
    id: 'bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona',
  })
  console.log('diory', diory.toObjectWithoutImage())
}

const dioryQueryCommand = program
  .command('query')
  .option('--text <value>', 'Query from text field')
  .option('--all', 'List all')
  .action(queryAction)
const dioryShowCommand = program.command('show').action(showAction)

export { dioryShowCommand, dioryQueryCommand }
