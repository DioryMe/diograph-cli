import { existsSync } from 'fs'
import { readFile, writeFile, rm } from 'fs/promises'
import { Room, RoomClient } from 'diograph-js'
import { LocalClient } from '@diograph/local-client'
import { S3Client } from '@diograph/s3-client'

interface RoomData {
  address: string
  contentClientType: 'LocalClient' | 'S3Client'
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
      let client
      try {
        if (roomData.contentClientType == 'LocalClient') {
          client = new LocalClient(roomData.address)
          await client.verify()
        } else {
          client = new S3Client(roomData.address)
          await client.verify()
        }
      } catch (error) {
        throw new Error(
          `Invalid room address in app-data.json: ${roomData.address} ${roomData.contentClientType} ${error}`,
        )
      }
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
