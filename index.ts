#!/usr/bin/env node

import { program } from 'commander'
import {
  createConnectionCommand /* listContentsConnectionCommand */,
} from './src/connectionCommand.js'
import { roomCommand } from './src/roomCommand.js'
import {
  dioryCreateCommand,
  dioryLinkCommand,
  dioryQueryCommand,
  dioryShowCommand,
  dioryUnlinkCommand,
} from './src/dioryCommand.js'
import { statusCommand } from './src/statusCommand.js'
import { listCommand } from './src/listCommand.js'
import { exportDiographCommand, exportDioryCommand } from './src/exportCommand.js'
import { importFileCommand /* importFolderCommand */ } from './src/importCommand.js'
import { configCommand } from './src/configCommand.js'
import { getFfmpegPath } from './src/configManager.js'
import { startCommand } from './src/startCommand.js'

const bootstrap = async () => {
  try {
    process.env.FFMPEG_PATH = await getFfmpegPath()
  } catch (error: any) {}

  program
    .version('0.1.1')
    .description('Execute Diograph commands from CLI')
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output usage information.')
    .action((opts) => {
      if (opts['dryRun']) {
        console.log('Dry run completed.')
        return
      }
    })

  program.option('--useConnectionInFocus', 'Instead of room in focus, use connection in focus')

  program.addCommand(statusCommand)
  program.addCommand(configCommand)
  program.addCommand(listCommand)

  program.addCommand(roomCommand)

  program
    .command('connection')
    .description('Manage connections')
    .addCommand(createConnectionCommand)
  // .addCommand(listContentsConnectionCommand)
  // .option('remove', 'Remove a connection')
  // .option('delete', 'Delete a connection')
  // .option('focus', 'Focus on a connection')

  program
    .command('diory')
    .description('Manage diories')
    .action(program.help)
    .addCommand(dioryQueryCommand)
    .addCommand(dioryShowCommand)
    .addCommand(dioryCreateCommand)
    .addCommand(dioryLinkCommand)
    .addCommand(dioryUnlinkCommand)
  // .option('create', 'Create a new diory')
  // .option('delete', 'Delete a diory')
  // .option('link', 'Link a diory')
  // .option('focus', 'Focus on a diory')

  program
    .command('import')
    .description('Import resources')
    .action(program.help)
    .addCommand(importFileCommand)
  // .addCommand(importFolderCommand)

  program.command('export').description('Export resources').action(program.help)
  // FIXME: Enabling these spoils `dcli diory query` command?!!?
  // .addCommand(exportDioryCommand)
  // .addCommand(exportDiographCommand)

  program
    .command('server')
    .description('Start server')
    .action(program.help)
    .addCommand(startCommand)

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
