import chalk from 'chalk'
import { generateDiory } from '@diograph/file-generator'
import { generateDiograph } from '@diograph/folder-generator'
import { roomInFocus } from './configManager.js'

const importCommand = async (commandName: string, filePath: string) => {
  const validCommands = ['file', 'folder']

  if (!validCommands.includes(commandName)) {
    console.error(
      chalk.red(
        `Invalid command: ${commandName}. Command should be one of the following: 'file', 'folder'.`,
      ),
    )
    process.exit(1)
  }

  let diograph
  switch (commandName) {
    case 'file':
      const diory = await generateDiory('', filePath)
      const room = await roomInFocus()
      room.diograph.addDiory(diory)

      // TODO: Update to latest folder-generator
      // TODO: Copy content to Content folder / connection (in focus)

      await room.saveRoom()

      break
    case 'folder':
      try {
        diograph = await generateDiograph(filePath)
      } catch (error: any) {
        if (/^FFMPEG_PATH not defined/.test(error.message)) {
          console.error(
            chalk.red(
              `Folder includes a video file which requires FFMPEG for diory generation. \nPlease use \`dcli config set FFMPEG_PATH [path to ffmpeg]\` to set it.`,
            ),
          )
          break
        }
        throw error
      }
      console.log('Hello diograph!', Object.keys(diograph.toObject()))
      break
    default:
      break
  }
}

export { importCommand }
