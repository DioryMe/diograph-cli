import chalk from 'chalk'
import { Command } from 'commander'

const exportDioryAction = async () => {
  console.log(chalk.red('Not implemented yet'))
}

const exportDiographAction = async () => {
  console.log(chalk.red('Not implemented yet'))
}

const exportDioryCommand = new Command('diory').action(exportDioryAction)

const exportDiographCommand = new Command('diograph').action(exportDiographAction)

const exportCommand = new Command('export')
  .description('Export resources')
  .addCommand(exportDioryCommand)
  .addCommand(exportDiographCommand)

export { exportCommand }
