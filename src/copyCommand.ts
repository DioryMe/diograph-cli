import chalk from 'chalk'
import { Command } from 'commander'
import { connectionInFocus, listRooms } from './utils/configManager.js'
import { getAvailableClients } from './utils/getAvailableClients.js'
import { constructAndLoadRoom } from '@diograph/diograph'

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
    const fromDiory = diograph.getDiory({
      id: fromDioryId,
    })

    // Get toDiory
    // NOTE: toDioryString is already validated to include a room-id so we can do this
    const [toDioryRoomId, toDioryId] = toDioryString.split(':')
    // Focus to the room toDioryRoomId

    // TODO: Some helper to configManager for this would be nice
    const roomConfig = (await listRooms())[toDioryRoomId]

    const availableClients = await getAvailableClients()
    const toRoom = await constructAndLoadRoom(
      roomConfig.address,
      roomConfig.clientType,
      availableClients,
    )

    const toDiory = toRoom.diograph.getDiory({
      id: toDioryId,
    })

    return {
      fromDiory,
      toDiory,
    }
  }

  // CASE 2: Copy from one room to another
  // - "room-id:" in fromDioryString means copying from room

  // TODO: These should be errors but don't know yet how to handle them properly...
  console.log(chalk.red('Not implemented yet'))
  return {}
}

interface copyDioryActionOptions {
  copyContent: boolean
}

const copyDioryAction = async (
  fromDioryString: string,
  toDioryString: string,
  options: copyDioryActionOptions,
) => {
  const { fromDiory, toDiory } = await parseDioryStringArguments(fromDioryString, toDioryString)

  if (!fromDiory || !toDiory) {
    // console.log(chalk.red('fromDiory or toDiory not found'))
    return
  }

  console.log('Copying diory', fromDiory.id, 'to', toDiory.id)
}

const copyCommand = new Command('copy')
  .arguments('<fromDiory> <toDiory>')
  .option('--copyContent', 'Copy also data object')
  .description('Copy diory from one room to another')
  .action(copyDioryAction)

export { parseDioryStringArguments, copyCommand }
