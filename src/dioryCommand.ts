import chalk from 'chalk'
import { connectionInFocus, listRooms, roomInFocus } from './utils/configManager.js'
import { Command, program } from 'commander'
import { IDiograph } from '@diograph/diograph/types'
import { getAvailableClients } from './utils/getAvailableClients.js'
import { constructAndLoadRoom } from '@diograph/diograph'

const searchFromRoom = (diograph: IDiograph, options: queryActionOptions) => {
  if (Object.keys(options).length === 0) {
    const searchResult = diograph.queryDiograph(options)
    return searchResult
  }

  if (options.text) {
    const textSearchResult = diograph.queryDiograph(options)
    return textSearchResult
  }

  const searchResult = diograph.queryDiographByDateAndGeo(options)

  return searchResult
}

interface queryActionOptions {
  date?: string
  dateStart?: string
  dateEnd?: string
  latlngStart?: string
  latlngEnd?: string
  text?: string
  all?: boolean
  allRooms?: boolean
}

const queryAction = async (options: queryActionOptions) => {
  if (Object.keys(options).length === 0) {
    console.log(chalk.red('Please provide a query criteria or --all'))
    process.exitCode = 1
    return
  }

  if (options.all) {
    options = {}
  }

  if (options.allRooms) {
    const roomConfigs = await listRooms()
    const availableClients = await getAvailableClients()
    Promise.all(
      Object.values(roomConfigs)
        .filter((roomConfig) => roomConfig.clientType === 'LocalClient')
        .map(async (localRoomConfig) => {
          const room = await constructAndLoadRoom(
            localRoomConfig.address,
            localRoomConfig.clientType,
            availableClients,
          )
          const diograph = room.diograph
          const results = searchFromRoom(diograph, options)

          console.log('searchResult', Object.keys(results))
        }),
    )
    return
  }

  const room = await (program.opts().useConnectionInFocus ? connectionInFocus() : roomInFocus())
  const diograph = room.diograph

  const results = searchFromRoom(diograph, options)
  console.log('searchResult', Object.keys(results))
}

const showAction = async (dioryId: string) => {
  const room = await (program.opts().useConnectionInFocus ? connectionInFocus() : roomInFocus())
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
    process.exitCode = 1
    return
  }
}

const createAction = async (text: string, id?: string) => {
  const room = await roomInFocus()
  const diograph = room.diograph

  try {
    const diory = diograph.addDiory({
      id: id || Date.now().toString(),
      text,
    })
    console.log('diory', diory.toObjectWithoutImage())

    await room.saveRoom()

    console.log(chalk.green(`Diory created!`))
  } catch (error: any) {
    console.log(chalk.red(error.message))
    process.exitCode = 1
    return
  }
}

const removeAction = async (id: string) => {
  const room = await roomInFocus()
  const diograph = room.diograph

  try {
    diograph.removeDiory({ id })

    await room.saveRoom()

    console.log(chalk.green(`Diory removed!`))
  } catch (error: any) {
    console.log(chalk.red(error.message))
    process.exitCode = 1
    return
  }
}

const linkAction = async (fromId: string, toId: string) => {
  const room = await roomInFocus()
  const diograph = room.diograph

  try {
    diograph.addDioryLink({ id: fromId }, { id: toId })
    console.log('diory', diograph.getDiory({ id: fromId }).toObjectWithoutImage())

    await room.saveRoom()

    console.log(chalk.green(`Diories linked!`))
  } catch (error: any) {
    console.log(chalk.red(error.message))
    process.exitCode = 1
    return
  }
}

const unlinkAction = async (fromId: string, toId: string) => {
  const room = await roomInFocus()
  const diograph = room.diograph

  try {
    diograph.removeDioryLink({ id: fromId }, { id: toId })
    console.log('diory', diograph.getDiory({ id: fromId }).toObjectWithoutImage())

    await room.saveRoom()

    console.log(chalk.green(`Diories unlinked!`))
  } catch (error: any) {
    console.log(chalk.red(error.message))
    process.exitCode = 1
    return
  }
}

const dioryQueryCommand = new Command('query')
  .option('--all', 'List all')
  .option('--text <value>', 'Query from text field')
  .option('--date <value>', 'Filter by date')
  .option('--dateStart <value>', 'Filter by startDate')
  .option('--dateEnd <value>', 'Filter by endDate')
  .option('--latlngStart <value>', 'Filter by latlngStart')
  .option('--latlngEnd <value>', 'Filter by latlngEnd')
  .option('--allRooms', 'Search from all rooms')
  .action(queryAction)

const dioryShowCommand = new Command('show').arguments('<diory-id>').action(showAction)

const dioryCreateCommand = new Command('create').arguments('<text> [id]').action(createAction)

const dioryRemoveCommand = new Command('remove').arguments('<id>').action(removeAction)

const dioryLinkCommand = new Command('link').arguments('<fromId> <toId>').action(linkAction)

const dioryUnlinkCommand = new Command('unlink').arguments('<fromId> <toId>').action(unlinkAction)

const dioryCommand = new Command('diory')
  .description('Manage diories')
  .action(program.help)
  .addCommand(dioryQueryCommand)
  .addCommand(dioryShowCommand)
  .addCommand(dioryCreateCommand)
  .addCommand(dioryRemoveCommand)
  .addCommand(dioryLinkCommand)
  .addCommand(dioryUnlinkCommand)
// .option('focus', 'Focus on a diory')

export {
  createAction,
  linkAction,
  unlinkAction,
  dioryShowCommand,
  dioryQueryCommand,
  dioryCreateCommand,
  dioryLinkCommand,
  dioryUnlinkCommand,
  dioryCommand,
}
