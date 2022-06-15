import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile, rm } from 'fs/promises'
import { join } from 'path'
import { Connection, Room, RoomClient } from 'diograph-js'
import { LocalClient } from '../local-client'
import { initiateAppData, saveAppData } from './app-data'
import { listLocalContentSource } from './listLocalContentSource'

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

  constructor() {}

  init = async () =>
    initiateAppData(APP_DATA_PATH).then(({ initiatedRooms, initiatedAppData }) => {
      this.rooms = initiatedRooms
      this.appData = initiatedAppData
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

      this.rooms.push(room)
      await saveAppData(this.rooms, APP_DATA_PATH)

      console.log('Room added.')
      return
    }

    if (command === 'appListRooms') {
      return this.appData.rooms
    }

    if (!this.rooms.length) {
      console.log('No rooms, please add one!')
      return
    }

    // TODO: Implement "room in focus" => defaults to first one
    const room = this.rooms[0]

    if (command === 'roomListConnections') {
      return room.connections.map((connection) => ({ address: connection.address }))
    }

    if (command === 'deleteRoom') {
      await room.deleteRoom()
      this.rooms.shift()
      await saveAppData(this.rooms, APP_DATA_PATH)
      console.log('Room deleted.')
      return
    }

    if (command === 'addConnection') {
      const connectionAddress = arg1 || process.cwd()
      const connection = new Connection({ address: connectionAddress, contentClient: 'local' })
      room.addConnection(connection)
      await room.saveRoom()
      console.log('Connection added.')
      return
    }

    if (command === 'listConnections') {
      const connections = this.rooms.flatMap((room) => room.connections)
      return connections.map((connection) => connection.address)
    }

    if (command === 'listClientContents') {
      const connection = room.connections[1]
      const list = await listLocalContentSource('/', connection.address)
      connection.diograph.mergeDiograph(list)
      connection.diograph.diories.forEach((diory) => {
        if (diory.data && diory.data[0].contentUrl) {
          connection.addContentUrl(diory.data[0].contentUrl, diory.id)
        }
      })
      await room.saveRoom()
      return
    }

    if (command === 'listClientContents2') {
      const connection = room.connections[1]
      const list = await listLocalContentSource('/Subfolder', connection.address)
      connection.diograph.mergeDiograph(list)
      connection.diograph.diories.forEach((diory) => {
        if (diory.data && diory.data[0].contentUrl) {
          connection.addContentUrl(diory.data[0].contentUrl, diory.id)
        }
      })
      await room.saveRoom()
      return
    }

    if (command === 'getDiograph' && room.diograph) {
      return room.diograph.diories
    }

    if (command === 'getDiory' && room.diograph) {
      const diory = await room.diograph.getDiory('some-diory-id')
      return diory
    }

    if (command === 'createDiory' && room.diograph) {
      await room.diograph.createDiory({ text: 'Superia' })
      await room.saveRoom()
      console.log('Diory created.')
      return
    }

    if (command === 'deleteDiory' && room.diograph) {
      await room.diograph.deleteDiory(arg1)
      await room.saveRoom()
      console.log('Diory deleted.')
      return
    }

    if (command === 'importDiory' && room.diograph) {
      // const filePath = arg1
      // const copyContent = arg2

      // const diory = await generator.generateDioryFromFile(filePath)
      // if (copyContent) {
      //   const sourceFileContent = await readFile(filePath)
      //   const tool = this.getTool(room.connections[0])
      //   const contentUrl = await tool.addContent(sourceFileContent, diory.id)
      //   diory.changeContentUrl(contentUrl)
      // }
      // await room.diograph.addDiory(diory)
      // await room.saveRoom()
      return
    }

    if (command === 'dryRun') {
      console.log('Dry run completed.')
    }

    throw new Error(`Invalid command '${command}' (or invalid room...)`)
  }
}

export { App }
