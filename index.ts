#!/usr/bin/env node

import { program } from 'commander'
import {
  createConnectionCommand /* listContentsConnectionCommand */,
} from './src/connectionCommand.js'
import { addRoomCommand, createRoomCommand, focusRoomCommand } from './src/roomCommand.js'
import {
  dioryCreateCommand,
  dioryLinkCommand,
  dioryQueryCommand,
  dioryShowCommand,
  dioryUnlinkCommand,
} from './src/dioryCommand.js'
import { statusCommand } from './src/statusCommand.js'
import { listConnectionsCommand, listRoomsCommand } from './src/listCommand.js'
import { exportDiographCommand, exportDioryCommand } from './src/exportCommand.js'
import { importFileCommand /* importFolderCommand */ } from './src/importCommand.js'
import { setConfigCommand } from './src/configCommand.js'
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

  program.command('status').description('Show status').action(statusCommand)

  program
    .command('config')
    .description('Set config values: FFMPEG_PATH or s3-credentials') //
    .action(program.help)
    .addCommand(setConfigCommand)

  program
    .command('list')
    .description('List rooms and connections')
    .action(program.help)
    .addCommand(listRoomsCommand)
    .addCommand(listConnectionsCommand)

  program
    .command('room')
    .description('Manage rooms')
    .action(program.help)
    .addCommand(createRoomCommand)
    .addCommand(addRoomCommand)
    .addCommand(focusRoomCommand)
  // .option('remove', 'Remove a room (arg1: roomAddress)')
  // .option('delete', 'Delete a room (arg1: roomAddress)')
  // .option('focus', 'Focus on a room (arg1: roomAddress)')

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
