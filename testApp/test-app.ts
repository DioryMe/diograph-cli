import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile, rm } from 'fs/promises'
import { join } from 'path'
import { Connection, Diory, Room } from '@diograph/diograph'
import { AppData, initiateAppData, saveAppData } from './app-data'
import { localDiographGenerator } from './localDiographGenerator'
import { generateFileDiory } from '@diograph/file-generator'
import { v4 as uuid } from 'uuid'
import { createRoom } from '../src/createRoom'
import { createConnection } from '../src/createConnection'
import { setRoomInFocus } from '../src/appCommands/setRoomInFocus'
import { getDefaultImage } from './utils'
import { setConnectionInFocus } from '../src/appCommands/setConnectionInFocus'

const appDataFolderPath = process.env['APP_DATA_FOLDER'] || join(process.cwd(), 'tmp')
if (!existsSync(appDataFolderPath)) {
  mkdirSync(appDataFolderPath)
}
const APP_DATA_PATH = join(appDataFolderPath, 'app-data.json')

class App {
  appData: AppData = {
    rooms: [],
    roomInFocus: null,
    connectionInFocus: null,
  }
  rooms: Room[] = []
  roomInFocus: Room | null = null
  connectionInFocus: Connection | null = null

  constructor() {}

  init = async () =>
    initiateAppData(APP_DATA_PATH).then(
      ({ initiatedRooms, initiatedAppData, roomInFocus, connectionInFocus }) => {
        this.rooms = initiatedRooms
        this.roomInFocus = roomInFocus
        this.connectionInFocus = connectionInFocus
        this.appData = initiatedAppData

        if (this.rooms.length) {
          return setRoomInFocus(this.rooms, 0, APP_DATA_PATH)
        }
        console.log('No rooms to initiate...')
      },
    )

  run = async (command: string, arg1: string, arg2: string, arg3: string) => {
    if (!command) {
      throw new Error('Command not provided to testApp(), please provide one')
    }

    // TODO: Should print out available options
    // - room list, connection list, connection contents etc.
    if (command === 'setRoomInFocus') {
      const roomIndex = parseInt(arg1)
      if (isNaN(roomIndex)) {
        throw new Error(`Please provide a number as index of room (now: ${arg1})`)
      }

      if (this.rooms.length < roomIndex + 1) {
        throw new Error(`There's only ${this.rooms.length} room available, no index ${roomIndex}`)
      }

      const { roomInFocus, connectionInFocus } = await setRoomInFocus(
        this.rooms,
        roomIndex,
        APP_DATA_PATH,
      )

      this.roomInFocus = roomInFocus
      this.connectionInFocus = connectionInFocus

      return
    }

    // TODO: Should print out available options
    // - room list, connection list, connection contents etc.
    if (command === 'setConnectionInFocus') {
      if (!this.roomInFocus) {
        console.log('setConnectionInFocus called but no room in focus!!')
        return
      }

      const connectionIndex = parseInt(arg1)
      if (isNaN(connectionIndex)) {
        throw new Error(`Please provide a number as index of connection (now: ${arg1})`)
      }

      if (this.roomInFocus.connections.length < connectionIndex + 1) {
        throw new Error(
          `There's only ${this.rooms.length} room available, no index ${connectionIndex}`,
        )
      }

      this.connectionInFocus = await setConnectionInFocus(
        connectionIndex,
        this.roomInFocus,
        this.rooms,
        APP_DATA_PATH,
      )

      return
    }

    if (command === 'resetApp') {
      // Remove app-data.json
      existsSync(APP_DATA_PATH) && (await rm(APP_DATA_PATH))
      console.log('App data removed.')
      return
    }

    if (command === 'createRoom') {
      const roomPath = arg1
      const contentClientType = arg2 || 'LocalClient'

      // Verify
      if (!roomPath) {
        throw new Error('Arg1 (=roomPath) not provided for createRoom(), please provide one')
      }

      if (!['LocalClient', 'S3Client'].includes(contentClientType)) {
        throw new Error(
          `createRoom error: contentClient type should be either LocalClient or S3Client`,
        )
      }
      if (this.rooms.find((existingRoom) => existingRoom.address === roomPath)) {
        throw new Error(`createRoom error: Room with address ${roomPath} already exists`)
      }

      // Execute
      const room = await createRoom(roomPath, contentClientType)

      // Add room to app
      this.rooms.push(room)

      // Set room in focus
      const { roomInFocus, connectionInFocus } = await setRoomInFocus(
        this.rooms,
        this.rooms.length - 1,
        APP_DATA_PATH,
      )
      this.roomInFocus = roomInFocus
      this.connectionInFocus = connectionInFocus

      console.log('Room added.')

      return
    }

    if (command === 'removeConnection' || command === 'deleteConnection') {
      if (!this.connectionInFocus || !this.roomInFocus) {
        console.log('No room or connection in focus')
        return
      }

      const succeeded = this.roomInFocus?.removeConnection(this.connectionInFocus)

      console.log(
        succeeded
          ? `SUCCESS: Connection ${this.connectionInFocus.address} removed from room.json`
          : 'FAIL: Connection removal failed',
      )

      // TODO: Add own client for connection in order to delete it...
      if (command === 'deleteConnection') {
        await this.connectionInFocus.deleteConnection() // this.roomInFocus.roomClient?.client)
      }

      // Set first connection in focus if exists
      this.connectionInFocus = await setConnectionInFocus(
        0,
        this.roomInFocus,
        this.rooms,
        APP_DATA_PATH,
      )

      await saveAppData(this.roomInFocus, this.connectionInFocus, this.rooms, APP_DATA_PATH)
      await this.roomInFocus.saveRoom()

      return
    }

    if (command === 'deleteRoom' || command === 'removeRoom') {
      if (!this.roomInFocus) {
        console.log('deleteRoom or removeRoom called but no room in focus!!')
        return
      }

      if (command == 'deleteRoom') {
        // Delete connections
        await Promise.all(
          this.roomInFocus.connections.map((connection) => {
            return connection.deleteConnection() // this.roomInFocus?.roomClient?.client)
          }),
        )

        // Delete room
        await this.roomInFocus.deleteRoom()
      }

      // Remove room from app-data
      const address = this.roomInFocus.address
      this.rooms = this.rooms.filter((existingRoom) => existingRoom.address !== address)

      // Take connection off from focus
      this.connectionInFocus = null

      // Set first room in focus if exists
      const { roomInFocus } = await setRoomInFocus(this.rooms, 0, APP_DATA_PATH)
      this.roomInFocus = roomInFocus

      // Save app-data
      await saveAppData(this.roomInFocus, this.connectionInFocus, this.rooms, APP_DATA_PATH)

      // Inform user
      console.log('Room deleted.')

      return
    }

    if (command === 'dryRun') {
      console.log('Dry run completed.')
      return
    }

    if (!this.roomInFocus || !this.roomInFocus.roomClient) {
      throw new Error('roomInFocus is missing')
    }

    if (command === 'listRooms') {
      return this.appData.rooms
    }

    if (!this.rooms.length) {
      console.log('No rooms, please add one!')
      return
    }

    if (command === 'listConnections') {
      return this.roomInFocus.connections.map((connection) => ({ address: connection.address }))
    }

    if (command === 'listAppConnections') {
      return this.rooms.map((availableRoom) => {
        return availableRoom.connections.map((connection) => ({ address: connection.address }))
      })
    }

    if (command === 'createConnection') {
      if (!this.roomInFocus) {
        throw new Error('createConnection called withouth having this.roomInFocus')
      }
      if (!arg1) {
        console.log(
          `Connection address (=arg1) not provided for createConnection(), using ${process.cwd()}`,
        )
      }
      const connectionAddress = arg1 || process.cwd()

      if (!arg2) {
        console.log(
          'ContentClientType (=arg2) not provided for createConnection(), using LocalClient',
        )
      }
      const contentClientType = arg2 || 'LocalClient'
      // TODO: Verify connectionAddress properly
      // - e.g. LocalClient.verify(connectionAddress)
      // - requires dynamic definition of Local/S3Client though...

      // Execute
      if (
        this.roomInFocus.connections.find((connection) => connectionAddress == connection.address)
      ) {
        console.log('Connection already exists in room but added it anyway')
      }
      await createConnection(this.roomInFocus, connectionAddress, contentClientType)

      // Set added connection in focus
      this.connectionInFocus = await setConnectionInFocus(
        this.roomInFocus.connections.length - 1,
        this.roomInFocus,
        this.rooms,
        APP_DATA_PATH,
      )

      return
    }

    if (command === 'listConnections') {
      const connections = this.rooms.flatMap((room) => room.connections)
      return connections.map((connection) => connection.address)
    }

    if (command === 'getDiograph' && this.roomInFocus.diograph) {
      return this.roomInFocus.diograph.toObject()
    }

    if (
      command === 'getConnectionDiograph' &&
      this.connectionInFocus &&
      this.connectionInFocus.diograph
    ) {
      return this.connectionInFocus.diograph.toObject()
    }

    if (command === 'getDiory' && this.roomInFocus.diograph) {
      const dioryId = arg1 || 'some-diory-id'
      const { id, links, text, latlng, date, data, created, modified } =
        await this.roomInFocus.diograph.getDiory({ id: dioryId })
      return {
        id,
        links,
        text,
        latlng,
        date,
        data,
        created,
        modified,
        image: 'http://localhost:3000/diory/32540931-bb4a-4bd7-bf00-2fe0e2be0b38',
        datobject: 'http://localhost:3000/content',
      }
    }

    // Didn't want to fix old diograph-js to make these work
    /*
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
    */

    // @diograph/diograph doesn't support these yet
    // - localDiographGenerator

    if (command === 'listConnectionContents') {
      const connection = this.connectionInFocus
      if (!connection) {
        throw new Error('listConnectionContents: No connection in focus')
      }

      const contentSourceInternalPath = arg1 || '/'

      console.log(`Listing contents of ${connection.address}`)
      const list = await localDiographGenerator(contentSourceInternalPath, connection.address)
      connection.diograph.mergeDiograph(list)
      connection.diograph.diories().forEach((diory) => {
        if (diory.data && diory.data[0].contentUrl) {
          connection.addContentUrl(diory.data[0].contentUrl, diory.id)
        }
      })
      await this.roomInFocus.saveRoom()
      // TODO: This could print out something: list of files?
      console.log(connection.contentUrls)
      return
    }

    if (command === 'importDioryFromFile' && this.roomInFocus.diograph) {
      const filePath = arg1
      const copyContent = arg2

      const dioryObject = await generateFileDiory(filePath, '')
      dioryObject.image = dioryObject.image ? dioryObject.image : getDefaultImage()
      const diory = new Diory(dioryObject)
      if (copyContent) {
        const sourceFileContent = await readFile(filePath)
        await this.roomInFocus.addContent(sourceFileContent, dioryObject.id)
        diory.changeContentUrl(dioryObject.id)
      }
      await this.roomInFocus.diograph.addDiory(diory)
      await this.roomInFocus.saveRoom()
      return
    }

    // TODO: This doesn't have any tests...
    // - because: TODO: Demo content room doesn't have absolute paths and THAT IS A PROBLEM!!!
    if (command === 'import') {
      const dioryId = arg1 // same as internalPath...
      const copyContent = arg2
      // TODO: How to define connections? Which is connectionInFocus?
      const nativeConnection = this.roomInFocus.connections[0]
      const sourceConnection = this.roomInFocus.connections[1]
      // 1. Import diory from connection's diograph to room's diograph
      const newDioryObject = sourceConnection.diograph.getDiory({ id: dioryId }).toObject()
      newDioryObject.id = uuid()
      const newDiory = new Diory(newDioryObject)
      this.roomInFocus.diograph?.addDiory(newDiory)
      if (copyContent) {
        // 2. Make content available also via native-connection
        const contentUrl = newDiory.getContentUrl()
        if (!contentUrl) {
          return
        }
        const fileContents = await sourceConnection.readContent(contentUrl)
        await nativeConnection.addContent(fileContents, contentUrl) // , nativeConnectionContentClient)
      }
      await this.roomInFocus.saveRoom()
      return
    }

    if (command === 'getContent') {
      return this.roomInFocus.getContent(arg1)
    }

    // TODO: This doesn't have any tests...
    if (command === 'writeFileFromContent') {
      const contentId = arg1
      const fileName = arg2
      const nativeConnection = this.roomInFocus.connections[0]
      const fileBuffer = await nativeConnection.readContent(contentId)
      await writeFile(fileName, fileBuffer)
      return
    }

    throw new Error(`Invalid command '${command}' (or forgot return...or invalid room...)`)
  }
}

export { App }
