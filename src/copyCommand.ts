import chalk from 'chalk'
import { Command } from 'commander'
import { connectionInFocus } from './utils/configManager.js'

const parseDioryStringArguments = (fromDioryString: string, toDioryString: string) => {
  if (fromDioryString.split(':').length > 1) {
    console.log(chalk.red('Not implemented yet'))
    return {}
  }

  return {
    fromDiory: fromDioryString,
    toDiory: toDioryString,
  }
}

interface copyDioryActionOptions {
  copyContent: boolean
}

const copyDioryAction = async (
  fromDioryString: string,
  toDioryString: string,
  options: copyDioryActionOptions,
) => {
  const { fromDiory, toDiory } = parseDioryStringArguments(fromDioryString, toDioryString)

  if (!fromDiory) {
    return
  }

  const connection = await connectionInFocus()
  const diograph = connection.diograph

  try {
    const diory = diograph.getDiory({
      id: fromDiory,
    })
    console.log('diory', diory.toObjectWithoutImage())
  } catch (error: any) {
    console.log(chalk.red(error.message))
  }
}

const copyCommand = new Command('copy')
  .arguments('<fromDiory> <toDiory>')
  .option('--copyContent', 'Copy also data object')
  .description('Copy diory from one room to another')
  .action(copyDioryAction)

export { copyCommand }
