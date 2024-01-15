#!/usr/bin/env node

import { program } from 'commander'
import { create } from './src/create'

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

  program.command('create <resource>').description('Create a resource').action(create)

  program.parse()

  if (!process.argv.slice(2).length) {
    program.outputHelp()
  }
}

bootstrap()
