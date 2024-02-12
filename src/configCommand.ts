import chalk from 'chalk'
import { setFfmpegPath } from './configManager.js'

const configCommand = async (commandName: string, envKey: string, envValue: string) => {
  const validCommands = ['set']

  if (!validCommands.includes(commandName)) {
    console.error(
      chalk.red(`Invalid command: ${commandName}. Command should be one of the following: 'set'.`),
    )
    process.exit(1)
  }

  switch (commandName) {
    case 'set':
      if (envKey === 'FFMPEG_PATH') {
        await setFfmpegPath(envValue)
        console.log(chalk.green(`FFMPEG_PATH set to ${envValue}`))
      }
      break
    default:
      break
  }
}

export { configCommand }
