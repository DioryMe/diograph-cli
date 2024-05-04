import { outputListRooms } from './appCommands/listRooms.js'
import { outputListConnections } from './appCommands/listConnections.js'
import { program } from 'commander'

const listRoomsAction = async () => {
  outputListRooms()
}

const listConnectionsAction = async () => {
  outputListConnections()
}

const listRoomsCommand = program //
  .command('rooms') //
  .action(listRoomsAction)

const listConnectionsCommand = program //
  .command('connections') //
  .action(listConnectionsAction)

export { listRoomsCommand, listConnectionsCommand }
