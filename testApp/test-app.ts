import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile, rm } from 'fs/promises'
import { join } from 'path'
import { Connection, Diory, Room, RoomClient } from 'diograph-js'
import { LocalClient } from '../local-client'
import { initiateAppData, saveAppData } from './app-data'
import { listLocalContentSource } from './listLocalContentSource'
import { Generator, getDefaultImage } from '@diograph/file-generator'
import { v4 as uuid } from 'uuid'

const appDataFolderPath = process.env['APP_DATA_FOLDER'] || join(process.cwd(), 'tmp')
if (!existsSync(appDataFolderPath)) {
  mkdirSync(appDataFolderPath)
}
const APP_DATA_PATH = join(appDataFolderPath, 'app-data.json')

interface RoomData {
  address: string
}

interface AppData {
  rooms: RoomData[]
}

class App {
  appData: AppData = {
    rooms: [],
  }
  rooms: Room[] = []
  roomInFocus?: Room

  constructor() {}

  init = async () =>
    initiateAppData(APP_DATA_PATH).then(({ initiatedRooms, initiatedAppData }) => {
      this.rooms = initiatedRooms
      this.appData = initiatedAppData
      this.roomInFocus = initiatedRooms[0]
    })

  run = async (command: string, arg1: string, arg2: string, arg3: string) => {
    if (!command) {
      throw new Error('Command not provided to testApp(), please provide one')
    }

    if (command === 'resetApp') {
      // Remove app-data.json
      existsSync(APP_DATA_PATH) && (await rm(APP_DATA_PATH))
      console.log('App data removed.')
      return
    }

    if (command === 'addRoom') {
      const roomPath = arg1
      if (!arg1) {
        throw new Error('Arg1 not provided for addRoom(), please provide one')
      }
      if (this.rooms.find((existingRoom) => existingRoom.address === roomPath)) {
        throw new Error(`addRoom error: Room with address ${roomPath} already exists`)
      }
      if (!existsSync(roomPath)) {
        mkdirSync(roomPath)
      }
      const client = new LocalClient(roomPath)
      const roomClient = new RoomClient(client)
      const room = new Room(roomClient)

      const connection = new Connection({
        address: join(roomPath, 'Diory Content'),
        contentClient: 'local',
      })
      room.addConnection(connection)

      await room.saveRoom()

      if (!this.rooms.length) {
        this.roomInFocus = room
      }
      this.rooms.push(room)
      await saveAppData(this.rooms, APP_DATA_PATH)

      console.log('Room added.')
      return
    }

    if (command === 'deleteRoom') {
      if (!this.roomInFocus) {
        return
      }
      await this.roomInFocus.deleteRoom()
      this.rooms.shift()
      await saveAppData(this.rooms, APP_DATA_PATH)
      console.log('Room deleted.')
      return
    }

    if (!this.roomInFocus) {
      throw new Error('roomInFocus is missing')
    }

    if (command === 'appListRooms') {
      return this.appData.rooms
    }

    if (!this.rooms.length) {
      console.log('No rooms, please add one!')
      return
    }

    if (command === 'roomListConnections') {
      return this.roomInFocus.connections.map((connection) => ({ address: connection.address }))
    }

    if (command === 'addConnection') {
      const connectionAddress = arg1 || process.cwd()
      const connection = new Connection({ address: connectionAddress, contentClient: 'local' })
      this.roomInFocus.addConnection(connection)
      await this.roomInFocus.saveRoom()
      console.log('Connection added.')
      return
    }

    if (command === 'listConnections') {
      const connections = this.rooms.flatMap((room) => room.connections)
      return connections.map((connection) => connection.address)
    }

    if (command === 'listClientContents') {
      const connection = this.roomInFocus.connections[1]
      const list = await listLocalContentSource('/', connection.address)
      connection.diograph.mergeDiograph(list)
      connection.diograph.diories.forEach((diory) => {
        if (diory.data && diory.data[0].contentUrl) {
          connection.addContentUrl(diory.data[0].contentUrl, diory.id)
        }
      })
      await this.roomInFocus.saveRoom()
      return
    }

    if (command === 'listClientContents2') {
      const connection = this.roomInFocus.connections[1]
      const list = await listLocalContentSource('/Subfolder', connection.address)
      connection.diograph.mergeDiograph(list)
      connection.diograph.diories.forEach((diory) => {
        if (diory.data && diory.data[0].contentUrl) {
          connection.addContentUrl(diory.data[0].contentUrl, diory.id)
        }
      })
      await this.roomInFocus.saveRoom()
      return
    }

    if (command === 'getDiograph' && this.roomInFocus.diograph) {
      return this.roomInFocus.diograph.diories
    }

    if (command === 'getDiory' && this.roomInFocus.diograph) {
      const diory = await this.roomInFocus.diograph.getDiory('some-diory-id')
      return diory
    }

    if (command === 'createDiory' && this.roomInFocus.diograph) {
      await this.roomInFocus.diograph.createDiory({ text: 'Superia' })
      await this.roomInFocus.saveRoom()
      console.log('Diory created.')
      return
    }

    if (command === 'deleteDiory' && this.roomInFocus.diograph) {
      await this.roomInFocus.diograph.deleteDiory(arg1)
      await this.roomInFocus.saveRoom()
      console.log('Diory deleted.')
      return
    }

    if (command === 'importDiory' && this.roomInFocus.diograph) {
      const filePath = arg1
      const copyContent = arg2

      const generator = new Generator()
      const { dioryObject, thumbnailBuffer, cid } = await generator.generateDioryFromFile(filePath)
      const dataUrl = thumbnailBuffer
        ? `data:image/jpeg;base64,${thumbnailBuffer.toString('base64')}`
        : getDefaultImage()
      dioryObject.image = dataUrl
      const diory = new Diory(dioryObject)
      if (copyContent) {
        const sourceFileContent = await readFile(filePath)
        await this.roomInFocus.addContent(sourceFileContent, cid || dioryObject.id)
        diory.changeContentUrl(cid || dioryObject.id)
      }
      await this.roomInFocus.diograph.addDiory(diory)
      await this.roomInFocus.saveRoom()
      return
    }

    if (command === 'import') {
      const dioryId = arg1 // same as internalPath...
      const copyContent = arg2
      const nativeConnection = this.roomInFocus.connections[0]
      const sourceConnection = this.roomInFocus.connections[1]
      // 1. Import diory from connection's diograph to room's diograph
      const newDioryObject = sourceConnection.diograph.getDiory(dioryId).toDioryObject()
      newDioryObject.id = uuid()
      const newDiory = new Diory(newDioryObject)
      this.roomInFocus.diograph?.addDiory(newDiory)
      if (copyContent) {
        // 2. Make content available also via native-connection
        const contentUrl = newDiory.getContentUrl()
        if (!contentUrl) {
          return
        }
        const fileContents = await this.roomInFocus.connections[1].readContent(contentUrl)
        const internalPath = await nativeConnection.addContent(fileContents, contentUrl)
        nativeConnection.addContentUrl(contentUrl, internalPath)
      }
      await this.roomInFocus.saveRoom()
      return
    }

    if (command === 'getContent') {
      return this.roomInFocus.getContent(arg1)
    }

    if (command === 'writeFile') {
      const contentId = arg1
      const fileName = arg2
      const fileBuffer = await this.roomInFocus.connections[0].readContent(contentId)
      await writeFile(fileName, fileBuffer)
      return
    }

    if (command === 'dryRun') {
      console.log('Dry run completed.')
      return
    }

    throw new Error(`Invalid command '${command}' (or forgot return...or invalid room...)`)
  }
}

export { App }
