import chalk from 'chalk'
import { Command } from 'commander'
import { connectionInFocus, listRooms } from './utils/configManager.js'
import { getAvailableClients } from './utils/getAvailableClients.js'
import { constructAndLoadRoom } from '@diograph/diograph'

// TODO: Move this to configManager?
const getRoom = async (roomId: string) => {
  const roomConfig = (await listRooms())[roomId]

  const availableClients = await getAvailableClients()
  const room = await constructAndLoadRoom(
    roomConfig.address,
    roomConfig.clientType,
    availableClients,
  )

  return room
}

const parseDioryStringArguments = async (fromDioryString: string, toDioryString: string) => {
  // ERROR 1: No "room-id:" in toDioryString means error
  if (!toDioryString.match(/.+:.+/)) {
    // TODO: These should be errors but don't know yet how to handle them properly...
    throw new Error('toDiory must include a room-id')
    // console.log(chalk.red('toDiory must include a room-id'))
    return {}
  }

  // CASE 1: Copying from connection to room
  // -  No "room-id:" in fromDioryString means copying from connection
  if (!fromDioryString.includes(':')) {
    // Get fromDiory
    const fromDioryId = fromDioryString
    const connection = await connectionInFocus()
    const diograph = connection.diograph
    const copyDiory = diograph.getDiory({
      id: fromDioryId,
    })

    // NOTE: toDioryString is already validated to include a room-id so we can do this
    const [toDioryRoomId, toDioryId] = toDioryString.split(':')

    const toRoom = await getRoom(toDioryRoomId)

    const parentDiory = toRoom.diograph.getDiory({
      id: toDioryId,
    })

    return {
      diory: copyDiory,
      sourceRoom: connection,
      destinationRoom: toRoom,
      parentDiory,
    }
  }

  // CASE 2: Copy from one room to another
  // - "room-id:" in fromDioryString means copying from room

  // Find from diory room & diory
  const [fromDioryRoomId, fromDioryId] = fromDioryString.split(':')
  const fromRoom = await getRoom(fromDioryRoomId)
  const copyDiory = fromRoom.diograph.getDiory({
    id: fromDioryId,
  })

  // Find to diory room & diory
  const [toDioryRoomId, toDioryId] = toDioryString.split(':')
  const toRoom = await getRoom(toDioryRoomId)
  const parentDiory = toRoom.diograph.getDiory({
    id: toDioryId,
  })

  return {
    diory: copyDiory,
    sourceRoom: fromRoom,
    destinationRoom: toRoom,
    parentDiory,
  }
}

interface copyDioryActionOptions {
  copyContent: boolean
}

const copyDioryAction = async (
  fromDioryString: string,
  toDioryString: string,
  options: copyDioryActionOptions,
) => {
  const { diory, destinationRoom, parentDiory, sourceRoom } = await parseDioryStringArguments(
    fromDioryString,
    toDioryString,
  )

  // For Typescript purposes...
  if (!diory || !destinationRoom || !parentDiory || !sourceRoom) {
    return
  }

  // Remove links as they don't point to correct diories in the destination room
  if (diory.links) {
    diory.links = [] as any
  }

  destinationRoom.diograph.addDioryAndLink(diory, parentDiory)

  // --copyContent
  if (options.copyContent) {
    const contentUrl = diory.data && diory.data[0].contentUrl
    if (contentUrl) {
      const sourceFileContent = await sourceRoom.readContent(contentUrl)
      await destinationRoom.addContent(sourceFileContent, contentUrl)
    }
  }

  await destinationRoom.saveRoom()

  chalk.green('Diory copied successfully', diory.id, 'to', parentDiory.id)
}

const copyCommand = new Command('copy')
  .arguments('<fromDiory> <toDiory>')
  .option('--copyContent', 'Copy also data object')
  .description('Copy diory from one room to another')
  .action(copyDioryAction)

export { parseDioryStringArguments, copyCommand }
