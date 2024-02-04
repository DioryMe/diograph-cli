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

  const room = await roomInFocus()
  let diograph
  switch (commandName) {
    case 'file':
      let diory
      try {
        diory = await generateDiory('', filePath)
      } catch (error: any) {
        if (/^FFMPEG_PATH not defined/.test(error.message)) {
          console.error(
            chalk.red(
              `Folder includes a video file which requires FFMPEG for diory generation. \nPlease use \`dcli config set FFMPEG_PATH [path to ffmpeg]\` to set it.`,
            ),
          )
          break
        }
        console.log(error.message)
        throw error
      }
      room.diograph.addDiory(diory)

      // TODO: Update to latest file-generator
      // TODO: Copy content to Content folder / connection (in focus)

      await room.saveRoom()

      console.log(diory.toObject())
      chalk.green('Import file success!')
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
        console.log(error.message)
        throw error
      }
      room.diograph.addDiograph(diograph.toObject())

      // TODO: Update to latest file-generator
      // TODO: Copy content to Content folder / connection (in focus)

      await room.saveRoom()

      console.log(Object.keys(diograph.toObject()))
      chalk.green('Import folder success!')
      break
    default:
      break
  }
}

export { importCommand }
