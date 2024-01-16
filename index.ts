#!/usr/bin/env node

import { program } from 'commander'
import { connectionCommand } from './src/connectionCommand'
import { roomCommand } from './src/roomCommand'
import { dioryCommand } from './src/dioryCommand'
import { statusCommand } from './src/statusCommand'
import { listCommand } from './src/listCommand'
import { exportCommand } from './src/exportCommand'

const bootstrap = async () => {
  program
    .version('0.0.1')
    .description('Execute Diograph commands from CLI')
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output usage information.')
    .option('--dry-run', 'Dry run')
    .action((opts) => {
      if (opts['dryRun']) {
        console.log('Dry run completed.')
        return
      }
    })

  program.command('status').description('Show status').action(statusCommand)
  program.command('list <resource>').description('List resources').action(listCommand)

  program.command('room <resource>').description('Manage rooms').action(roomCommand)
  program
    .command('connection <resource>')
    .description('Manage connections')
    .action(connectionCommand)
  program.command('diory <resource>').description('Manage diories').action(dioryCommand)

  program.command('import <resource>').description('Import resources').action(exportCommand)
  program.command('export <resource>').description('Export resources').action(exportCommand)

  program.parse()

  if (!process.argv.slice(2).length) {
    program.outputHelp()
  }
}

bootstrap()
