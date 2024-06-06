import { Command } from 'commander'
import { connectionInFocusAddress, roomInFocusId } from './utils/configManager.js'
import chalk from 'chalk'

const showStatusCommand = async () => {
  const output = await generateOutput()
  console.log(output)
}

const generateOutput = async () => {
  try {
    const loadedRoomInFocusId = await roomInFocusId()
    const loadedConnectionInFocusAddress = await connectionInFocusAddress()

    return [
      `Room in focus: ${loadedRoomInFocusId}`,
      `Connection in focus: ${loadedConnectionInFocusAddress}`,
    ].join('\n')
  } catch (error: any) {
    return chalk.red(error.message)
  }
}

const statusCommand = new Command('status')
  .description('Show app status and focuses')
  .action(showStatusCommand)

export { statusCommand }
