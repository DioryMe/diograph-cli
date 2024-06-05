import { Command } from 'commander'
import { connectionInFocusAddress, roomInFocusId } from './configManager.js'
import chalk from 'chalk'

const showStatusCommand = async () => {
  const output = await generateOutput()
  console.log(output)
}

// TODO: Generate table output with column headers
const generateOutput = async () => {
  try {
    const loadedRoomInFocusId = await roomInFocusId()
    const loadedConnectionInFocusAddress = connectionInFocusAddress()

    return [
      `Room in focus: ${loadedRoomInFocusId}`,
      `Connection in focus: ${loadedConnectionInFocusAddress}`,
    ].join('\n')
  } catch (error: any) {
    return chalk.red(error.message)
  }
}

const statusCommand = new Command('status').description('Show status').action(showStatusCommand)

export { statusCommand }
