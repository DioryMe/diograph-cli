import chalk from 'chalk'
import { setFfmpegPath } from './configManager.js'
import { program } from 'commander'

const setAction = async (configKey: string, configValue: string) => {
  switch (configKey) {
    case 'FFMPEG_PATH':
      await setFfmpegPath(configValue)
      break
    default:
      break
  }
  console.log(chalk.green(`${configKey} set to ${configValue}`))
}

const setConfigCommand = program //
  .command('set <configKey> <configValue>') //
  .action(setAction)

export { setConfigCommand }
