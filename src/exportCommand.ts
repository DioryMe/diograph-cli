import chalk from 'chalk'
import { program } from 'commander'

const exportDioryAction = async () => {
  console.log(chalk.red('Not implemented yet'))
}

const exportDiographAction = async () => {
  console.log(chalk.red('Not implemented yet'))
}

const exportDioryCommand = program.command('diory').action(exportDioryAction)

const exportDiographCommand = program.command('diograph').action(exportDiographAction)

export { exportDioryCommand, exportDiographCommand }
