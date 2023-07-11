import { existsSync } from 'fs'
import { readFile, writeFile, rm } from 'fs/promises'
import { Room, RoomClient } from 'diograph-js'
import { LocalClient } from '@diograph/local-client'
import { S3Client } from '@diograph/s3-client'

interface RoomData {
  address: string
  roomClientType: 'LocalClient' | 'S3Client'
}

export interface AppData {
  roomInFocus: string | null
  rooms: RoomData[]
}

export const getClientAndVerify = async (clientType: string, address: string) => {
  let client
  if (clientType == 'LocalClient') {
    client = new LocalClient(address)
    await client.verify()
  } else if ('S3Client') {
    client = new S3Client(address)
    await client.verify()
  } else {
    throw new Error(`getClientAndVerify: Unknown clientType: ${clientType}`)
  }

  return client
}

export const initiateRoom = async (contentClientType: string, address: string) => {
  const client = await getClientAndVerify(contentClientType, address)
  const roomClient = new RoomClient(client)
  const room = new Room(roomClient)
  return room
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
      let room
      try {
        room = await initiateRoom(roomData.roomClientType, roomData.address)
      } catch (error) {
        throw new Error(
          `Invalid room address in app-data.json: ${roomData.address} ${roomData.roomClientType} ${error}`,
        )
      }
      rooms.push(room)
      return room.loadRoom()
    }),
  )

  return {
    initiatedRooms: rooms,
    initiatedAppData: appData,
    roomInFocus: rooms.find(({ address }) => address === appData.roomInFocus),
  }
}

const saveAppData = async (roomInFocus: Room, rooms: Room[], appDataPath: string) => {
  const jsonAppData = {
    roomInFocus: roomInFocus.address,
    rooms: rooms.map((room) => ({
      address: room.address,
      roomClientType: room.roomClientType,
    })),
  }
  await writeFile(appDataPath, JSON.stringify(jsonAppData, null, 2))
}

export { initiateAppData, saveAppData }
