import chalk from 'chalk'
import { setFfmpegPath, setS3Credentials } from './configManager.js'
import { Command } from 'commander'

const setAction = async (configKey: string, configValue: string) => {
  switch (configKey) {
    case 'FFMPEG_PATH':
      await setFfmpegPath(configValue)
      break
    case 's3-credentials':
      if (!/^([A-Z0-9]{20})\s(\S{40})$/.test(configValue)) {
        console.log(
          chalk.red(
            'Invalid value for s3-credentials, should be given as: "[ACCESS_KEY] [SECRET_KEY]"',
          ),
        )
        return
      }
      const [accessKeyId, secretAccessKey] = configValue.split(' ')
      await setS3Credentials({ accessKeyId, secretAccessKey })
      break
    default:
      console.log(chalk.red(`Unknown key ${configKey}`))
      return
  }
  console.log(chalk.green(`${configKey} set to the given value`))
}

const setConfigCommand = new Command('set') //
  .arguments('<configKey> <configValue>')
  .action(setAction)

const configCommand = new Command('config')
  .description('Set config values: FFMPEG_PATH or s3-credentials') //
  .addCommand(setConfigCommand)

export { configCommand }
