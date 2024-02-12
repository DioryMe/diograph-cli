#!/usr/bin/env node

import { program } from 'commander'
import { createConnectionCommand, listContentsConnectionCommand } from './src/connectionCommand.js'
import { addRoomCommand, createRoomCommand } from './src/roomCommand.js'
import { dioryQueryCommand, dioryShowCommand } from './src/dioryCommand.js'
import { statusCommand } from './src/statusCommand.js'
import { listCommand } from './src/listCommand.js'
import { exportCommand } from './src/exportCommand.js'
import { importFileCommand, importFolderCommand } from './src/importCommand.js'
import { configCommand } from './src/configCommand.js'
import { getFfmpegPath } from './src/configManager.js'

const bootstrap = async () => {
  try {
    process.env.FFMPEG_PATH = await getFfmpegPath()
  } catch (error: any) {}

  program
    .version('0.1.0')
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
    .command('config <command> <envKey> <envValue>')
    .description('Set config values')
    .option('set', 'Set a config value')
    .action(configCommand)

  program
    .command('list <resource>')
    .description('List resources')
    .option('rooms', 'List all rooms')
    .option('connections', 'List all connections')
    .action(listCommand)

  program
    .command('room')
    .description('Manage rooms')
    .action(program.help)
    .addCommand(createRoomCommand)
    .addCommand(addRoomCommand)
  // .option('remove', 'Remove a room (arg1: roomAddress)')
  // .option('delete', 'Delete a room (arg1: roomAddress)')
  // .option('focus', 'Focus on a room (arg1: roomAddress)')

  program
    .command('connection')
    .description('Manage connections')
    .addCommand(createConnectionCommand)
    .addCommand(listContentsConnectionCommand)
  // .option('remove', 'Remove a connection')
  // .option('delete', 'Delete a connection')
  // .option('focus', 'Focus on a connection')

  program
    .command('diory')
    .description('Manage diories')
    .action(program.help)
    .addCommand(dioryQueryCommand)
    .addCommand(dioryShowCommand)
  // .option('create', 'Create a new diory')
  // .option('delete', 'Delete a diory')
  // .option('link', 'Link a diory')
  // .option('focus', 'Focus on a diory')

  program
    .command('import')
    .description('Import resources')
    .action(program.help)
    .addCommand(importFileCommand)
    .addCommand(importFolderCommand)

  program
    .command('export <type>')
    .description('Export resources')
    .option('diory', 'Export a diory')
    .option('diograph', 'Export a diograph')
    .option('content', 'Export content')
    .option('room', 'Export a room')
    .action(exportCommand)

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
