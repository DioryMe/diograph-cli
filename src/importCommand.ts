import chalk from 'chalk'
import { generateDiograph } from '@diograph/folder-generator'
import { generateDiory } from '@diograph/file-generator'
import { roomInFocus } from './utils/configManager.js'
import { readFile } from 'fs/promises'
import { Command } from 'commander'

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
      process.exitCode = 1
      return
    }
    console.log(error.message)
    throw error
  }

  // TODO: Specify diory to be linked with --fromDioryId argument
  room.diograph.addDioryAndLink(diory)

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
  let generateDiographReturnValue
  try {
    generateDiographReturnValue = await generateDiograph(filePath)
  } catch (error: any) {
    if (/^FFMPEG_PATH not defined/.test(error.message)) {
      console.error(
        chalk.red(
          `Folder includes a video file which requires FFMPEG for diory generation. \nPlease use \`dcli config set FFMPEG_PATH [path to ffmpeg]\` to set it.`,
        ),
      )
      process.exitCode = 1
      return
    }
    console.log(error.message)
    throw error
  }

  const diograph = generateDiographReturnValue.diograph

  room.diograph.initialise(diograph.toObject())

  // TODO: Copy content to Content folder / connection (in focus)

  await room.saveRoom()

  console.log(Object.keys(diograph.toObject()))
  chalk.green('Import folder success!')
}

const importFileCommand = new Command('file')
  .arguments('<filePath>')
  .option('--copyContent', 'Copy content')
  .action(fileAction)

const importFolderCommand = new Command('folder')
  .arguments('<filePath>')
  // .option('--copyContent', 'Copy content')
  .action(folderAction)

const importCommand = new Command('import')
  .description('Import resources')
  .addCommand(importFileCommand)
  .addCommand(importFolderCommand)

export { importCommand }
