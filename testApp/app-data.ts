import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile, rm } from 'fs/promises'
import { Connection, Room, RoomClient } from 'diograph-js'
import { LocalClient } from '../local-client'

interface RoomData {
  address: string
}

interface AppData {
  rooms: RoomData[]
}

const initiateAppData = async (appDataPath: string) => {
  // Initiate app data if doesn't exist yet
  if (!existsSync(appDataPath)) {
    const defaultAppData = { rooms: [] }
    await writeFile(appDataPath, JSON.stringify(defaultAppData, null, 2))
  }

  const appDataContents = await readFile(appDataPath, { encoding: 'utf8' })
  const appData: AppData = JSON.parse(appDataContents)

  // Load rooms
  const rooms: Room[] = []
  await Promise.all(
    appData.rooms.map(async (roomData: RoomData) => {
      if (!existsSync(roomData.address)) {
        throw new Error('Invalid room address in app-data.json')
      }
      const client = new LocalClient(roomData.address)
      const roomClient = new RoomClient(client)
      const room = new Room(roomClient)
      rooms.push(room)
      return room.loadRoom()
    }),
  )

  return { initiatedRooms: rooms, initiatedAppData: appData }
}

const saveAppData = async (rooms: Room[], appDataPath: string) => {
  const jsonAppData = {
    rooms: rooms.map((room) => ({ address: room.address })),
  }
  await writeFile(appDataPath, JSON.stringify(jsonAppData, null, 2))
}

export { initiateAppData, saveAppData }
