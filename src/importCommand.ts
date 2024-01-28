import chalk from 'chalk'
import { generateDiory } from '@diograph/file-generator'
import { generateDiograph } from '@diograph/folder-generator'

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

  switch (commandName) {
    case 'file':
      const diory = await generateDiory('', filePath)
      const dioryObject = diory.toObject()
      dioryObject.image = '[omitted]'
      console.log('Hello diory!', dioryObject)
      break
    case 'folder':
      let diograph
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
