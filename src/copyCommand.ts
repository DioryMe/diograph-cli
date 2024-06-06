import chalk from 'chalk'
import { Command } from 'commander'

const copyDioryAction = async () => {
  console.log(chalk.red('Not implemented yet'))
}

const copyCommand = new Command('copy')
  .arguments('<fromDiory> <toDiory>')
  .action(copyDioryAction)
  .option('--copyContent', 'Copy also data object')
  .description('Copy diory from one room to another')

export { copyCommand }
