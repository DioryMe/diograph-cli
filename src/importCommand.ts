import chalk from 'chalk'
import { generateDiograph } from '@diograph/folder-generator'
import { generateDiory } from '@diograph/file-generator'
import { roomInFocus } from './utils/configManager.js'
import { readFile } from 'fs/promises'
import { Command } from 'commander'
import { join } from 'path'
import { promises as fsPromises } from 'fs'

interface fileActionOptions {
  fromDioryId?: string
  diographOnly: boolean
}

const fileAction = async (filePath: string, options: fileActionOptions) => {
  const room = await roomInFocus()

  let fromDiory
  if (options.fromDioryId) {
    try {
      fromDiory = room.diograph.getDiory({ id: options.fromDioryId })
    } catch (error: any) {
      if (error.message.startsWith('getDiory: Item not found')) {
        console.log(chalk.red(`fromDiory with id ${options.fromDioryId} not found in the room`))
        process.exitCode = 1
        return
      }
      throw error
    }
  }

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

  // Link imported diory to given fromDiory or room's root diory
  room.diograph.addDioryAndLink(diory, fromDiory ? { id: fromDiory.id } : undefined)

  if (!options.diographOnly) {
    const sourceFileContent = await readFile(filePath)
    await room.addContent(sourceFileContent, diory.id)
  }

  await room.saveRoom()

  console.log(diory.toObject())
  chalk.green('Import file success!')
}

interface folderActionOptions {
  address?: string
  here?: boolean
  fromDioryId?: string
  diographOnly?: boolean
}

const folderAction = async (options: folderActionOptions) => {
  if (Object.keys(options).length === 0) {
    console.log(chalk.red('Please provide a room --address or --here'))
    process.exitCode = 1
    return
  }

  const room = await roomInFocus()

  let fromDiory
  if (options.fromDioryId) {
    try {
      fromDiory = room.diograph.getDiory({ id: options.fromDioryId })
    } catch (error: any) {
      if (error.message.startsWith('getDiory: Item not found')) {
        console.log(chalk.red(`fromDiory with id ${options.fromDioryId} not found in the room`))
        process.exitCode = 1
        return
      }
      throw error
    }
  }

  const folderPath = options.here || !options.address ? process.cwd() : options.address

  let generateDiographReturnValue
  try {
    generateDiographReturnValue = await generateDiograph(folderPath)
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

  const folderDiograph = generateDiographReturnValue.diograph

  // Merge folderDiograph with room's existing diograph
  const folderDiographRootDioryId = folderDiograph.diograph['/'].id
  folderDiograph.diograph['/'].id = '/'
  room.diograph.initialise(folderDiograph.toObject())

  // Link folderDiograph's root diory to given fromDiory or room's root diory
  fromDiory = fromDiory || room.diograph.getDiory({ id: '/' })
  fromDiory.addLink({ id: folderDiographRootDioryId })

  if (!options.diographOnly) {
    await Promise.all(
      Object.entries(generateDiographReturnValue.paths).map(async ([cid, contentPath]) => {
        const filePath = join(folderPath, contentPath)
        try {
          await fsPromises.access(filePath)
          const stats = await fsPromises.stat(filePath)
          if (stats.isDirectory()) {
            return
          }
          const sourceFileContent = await fsPromises.readFile(filePath)
          return room.addContent(sourceFileContent, cid)
        } catch (error: any) {
          if (error.code === 'ENOENT') {
            console.error(`importFolder copyContent error: ${filePath} not found`)
            return
          }
          throw error
        }
      }),
    )
  }

  await room.saveRoom()

  console.log(Object.keys(folderDiograph.toObject()))
  chalk.green('Import folder success!')
}

const importFileCommand = new Command('file')
  .arguments('<filePath>')
  .option('--fromDioryId <value>', 'Link imported file to given diory')
  .option('--diographOnly', "Only diory to diograph, don't copy content")
  .action(fileAction)

const importFolderCommand = new Command('folder')
  .option('--address <value>', 'Import folder from given path')
  .option('--here', 'Import folder from current directory')
  .option('--fromDioryId <value>', "Link imported folder's root diory to given diory")
  .option('--diographOnly', "Import only diograph, don't copy contents")
  .action(folderAction)

const importCommand = new Command('import')
  .description('Import resources')
  .addCommand(importFileCommand)
  .addCommand(importFolderCommand)

export { importCommand }
