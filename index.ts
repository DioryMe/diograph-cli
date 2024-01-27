#!/usr/bin/env node

import { program } from 'commander'
import { connectionCommand } from './src/connectionCommand.js'
import { roomCommand } from './src/roomCommand.js'
import { dioryCommand } from './src/dioryCommand.js'
import { statusCommand } from './src/statusCommand.js'
import { listCommand } from './src/listCommand.js'
import { exportCommand } from './src/exportCommand.js'
import { importCommand } from './src/importCommand.js'

const bootstrap = async () => {
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
    .command('list <resource>')
    .description('List resources')
    .option('rooms', 'List all rooms')
    .option('connections', 'List all connections')
    .action(listCommand)

  program
    .command('room <command> [arg1] [arg2]')
    .description('Manage rooms')
    .option('create', 'Create a new room (arg1: roomAddress, arg2: contentClientType)')
    .option('remove', 'Remove a room (arg1: roomAddress)')
    .option('delete', 'Delete a room (arg1: roomAddress)')
    .option('focus', 'Focus on a room (arg1: roomAddress)')
    .action(roomCommand)

  program
    .command('connection <command> [arg1] [arg2]')
    .description('Manage connections')
    .option('create', 'Create a new connection')
    .option('remove', 'Remove a connection')
    .option('delete', 'Delete a connection')
    .option('focus', 'Focus on a connection')
    .option('listContents', 'List connection contents')
    .action(connectionCommand)

  program
    .command('diory <command>')
    .description('Manage diories')
    .option('create', 'Create a new diory')
    .option('delete', 'Delete a diory')
    .option('link', 'Link a diory')
    .option('focus', 'Focus on a diory')
    .action(dioryCommand)

  program
    .command('import <type> <filePath>')
    .description('Import resources')
    .option('file', 'Import from a file')
    .option('folder', 'Import from a folder')
    .action(importCommand)

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
