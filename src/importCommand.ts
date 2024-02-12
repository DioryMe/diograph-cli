import chalk from 'chalk'
import { generateDiory } from '@diograph/file-generator'
import { generateDiograph } from '@diograph/folder-generator'
import { roomInFocus } from './configManager.js'
import { readFile } from 'fs/promises'
import { program } from 'commander'

interface fileActionOptions {
  copyContent: boolean
}

const fileAction = async (filePath: string, options: fileActionOptions) => {
  const room = await roomInFocus()
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
      return
    }
    console.log(error.message)
    throw error
  }

  room.diograph.addDiory(diory)

  // --copyContent
  if (options.copyContent) {
    const sourceFileContent = await readFile(filePath)
    await room.addContent(sourceFileContent, diory.id)
    // diory.changeContentUrl(dioryObject.id)
  }

  await room.saveRoom()

  console.log(diory.toObject())
  chalk.green('Import file success!')
}

const folderAction = async (filePath: string) => {
  const room = await roomInFocus()
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
      return
    }
    console.log(error.message)
    throw error
  }
  room.diograph.addDiograph(diograph.toObject())

  // TODO: Copy content to Content folder / connection (in focus)

  await room.saveRoom()

  console.log(Object.keys(diograph.toObject()))
  chalk.green('Import folder success!')
}

const importFileCommand = program
  .command('file <filePath>')
  .option('--copyContent', 'Copy content')
  .action(fileAction)

const importFolderCommand = program
  .command('folder <filePath>')
  // .option('--copyContent', 'Copy content')
  .action(folderAction)

export { importFileCommand, importFolderCommand }
