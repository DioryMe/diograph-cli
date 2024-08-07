#!/usr/bin/env node

import { program } from 'commander'
import { connectionCommand } from './src/connectionCommand.js'
import { roomCommand } from './src/roomCommand.js'
import { dioryCommand } from './src/dioryCommand.js'
import { statusCommand } from './src/statusCommand.js'
import { listCommand } from './src/listCommand.js'
import { importCommand } from './src/importCommand.js'
import { configCommand } from './src/configCommand.js'
import { getFfmpegPath } from './src/utils/configManager.js'
import { serverCommand } from './src/serverCommand.js'
import { copyCommand } from './src/copyCommand.js'

const bootstrap = async () => {
  try {
    process.env.FFMPEG_PATH = await getFfmpegPath()
  } catch (error: any) {}

  program
    .version('0.1.3')
    .description('Execute Diograph commands from CLI')
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output usage information.')

  program.option('--useConnectionInFocus', 'Instead of room in focus, use connection in focus')

  program.addCommand(statusCommand)
  program.addCommand(configCommand)
  program.addCommand(listCommand)

  program.addCommand(roomCommand)
  program.addCommand(connectionCommand)
  program.addCommand(dioryCommand)

  program.addCommand(importCommand)
  program.addCommand(copyCommand)

  program.addCommand(serverCommand)

  program.parse()

  const knownCommands = program.commands.map((cmd) => cmd.name())
  if (!process.argv.slice(2).length) {
    program.outputHelp()
  } else if (!process.argv.slice(2).length || !knownCommands.includes(process.argv[2])) {
    console.error(`error: unknown command '${process.argv[2]}'`)
    console.log(`Available commands: ${knownCommands.join(', ')}`)
    process.exitCode = 1
  }
}

bootstrap()
