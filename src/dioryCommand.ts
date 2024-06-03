import chalk from 'chalk'
import { roomInFocus } from './configManager.js'
import { program } from 'commander'

interface queryActionOptions {
  text?: string
  all?: boolean
}

const queryAction = async (options: queryActionOptions) => {
  if (Object.keys(options).length === 0) {
    console.log(chalk.red('Please provide a query criteria or --all'))
    return
  }

  if (options.all) {
    options = {}
  }

  const room = await roomInFocus() // await connectionInFocus()
  const diograph = room.diograph

  const searchResult = diograph.queryDiograph(options)
  console.log('searchResult', Object.keys(searchResult.toObject()))
}

const showAction = async (dioryId: string) => {
  const room = await roomInFocus() // await connectionInFocus()
  const diograph = room.diograph

  try {
    const diory = diograph.getDiory({
      id: dioryId,
    })
    console.log('diory', diory.toObjectWithoutImage())
    console.log('Image link:', `http://localhost:3000/room-1/thumbnail?dioryId=${diory.id}`)
    if (diory.data && diory.data.length) {
      console.log(
        'Content link:',
        `http://localhost:3000/room-1/content?cid=${diory.data[0].contentUrl}&mime=${diory.data[0].encodingFormat}`,
      )
      console.log(
        'S3 Content link:',
        `http://localhost:3000/s3?cid=${diory.data[0].contentUrl}&mime=${diory.data[0].encodingFormat}`,
      )
    }
  } catch (error: any) {
    console.log(chalk.red(error.message))
  }
}

const createAction = async (text: string) => {
  const room = await roomInFocus() // await connectionInFocus()
  const diograph = room.diograph

  try {
    const diory = diograph.addDiory({
      id: Date.now().toString(),
      text,
    })
    console.log('diory', diory.toObjectWithoutImage())

    await room.saveRoom()

    console.log(chalk.green(`Diory created!`))
  } catch (error: any) {
    console.log(chalk.red(error.message))
  }
}

const linkAction = async (fromId: string, toId: string) => {
  const room = await roomInFocus() // await connectionInFocus()
  const diograph = room.diograph

  try {
    diograph.addDioryLink({ id: fromId }, { id: toId })
    console.log('diory', diograph.getDiory({ id: fromId }).toObjectWithoutImage())

    await room.saveRoom()

    console.log(chalk.green(`Diories linked!`))
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

const dioryCreateCommand = program.command('create <text>').action(createAction)

const dioryLinkCommand = program.command('link <fromId> <toId>').action(linkAction)

export {
  createAction,
  linkAction,
  dioryShowCommand,
  dioryQueryCommand,
  dioryCreateCommand,
  dioryLinkCommand,
}
