import chalk from 'chalk'
import { outputListRooms } from './appCommands/listRooms.js'
import { outputListConnections } from './appCommands/listConnections.js'

const listCommand = (resourceName: string) => {
  const validResources = ['rooms', 'connections']

  if (!validResources.includes(resourceName)) {
    console.error(
      chalk.red(
        `Invalid resource: ${resourceName}. Resource should be either 'rooms' or 'connections'`,
      ),
    )
    process.exit(1)
  }

  switch (resourceName) {
    case 'rooms':
      outputListRooms()
      break
    case 'connections':
      outputListConnections()
      break
    default:
      break
  }
}

export { listCommand }
