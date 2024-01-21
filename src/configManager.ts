import fs from 'fs/promises'
import ini from 'ini'
import { dcliConfigPath } from './appConfig.js'
import { getClientAndVerify } from './createRoom.js'
import { Room, RoomClient } from '@diograph/diograph'
import { LocalClient } from '@diograph/local-client'

export interface ConfigObject {
  focus: {
    connectionInFocus: string
    roomInFocus: string
  }
  rooms: {
    [key: string]: {
      address: string
      roomClientType: string
    }
  }
}

const defaultConfigObject: ConfigObject = {
  focus: {
    connectionInFocus: '',
    roomInFocus: '',
  },
  rooms: {},
}

const addRoom = async (roomAddress: string, roomClientType: string): Promise<void> => {
  const configObject = await readConfig()
  configObject.rooms[roomAddress] = {
    address: roomAddress,
    roomClientType: roomClientType,
  }
  await writeConfig(configObject)
}

const setRoomInFocus = async (roomAddress: string): Promise<void> => {
  const configObject = await readConfig()
  configObject.focus.roomInFocus = roomAddress
  await writeConfig(configObject)
}

const setConnectionInFocus = async (connectionAddress: string): Promise<void> => {
  const configObject = await readConfig()
  configObject.focus.connectionInFocus = connectionAddress
  await writeConfig(configObject)
}

const writeConfig = async (configObject: ConfigObject): Promise<void> => {
  // TODO: Validate configObject to verify that it has the correct structure before writing it to file
  await fs.writeFile(dcliConfigPath, ini.stringify(configObject))
  console.log(`Configuration written to: ${dcliConfigPath}`)
}

const listRooms = async () => {
  const configObject = await readConfig()
  return configObject.rooms
}

const connectionInFocusId = async (): Promise<string> => {
  const configObject = await readConfig()
  return configObject.focus.connectionInFocus
}

const roomInFocusId = async (): Promise<string> => {
  const configObject = await readConfig()
  return configObject.focus.roomInFocus
}

// TODO: Credentials missing here...
const findRoom = async (roomAddress: string): Promise<Room> => {
  const configObject = await readConfig()
  const address = configObject.rooms[roomAddress].address
  const roomClientType = configObject.rooms[roomAddress].roomClientType

  const client = await getClientAndVerify(roomClientType, address)
  const roomClient = new RoomClient(client)
  return new Room(roomClient)
}

export const roomInFocus = async (): Promise<Room> => {
  const roomId = await roomInFocusId()
  const room = await findRoom(roomId)
  await room.loadRoom({
    LocalClient: {
      clientConstructor: LocalClient,
    },
    // S3Client: {
    //   clientConstructor: S3Client,
    //   credentials: { region: 'eu-west-1', credentials },
    // },
  })
  return room
}

const readConfig = async (): Promise<ConfigObject> => {
  const iniContent = await fs.readFile(dcliConfigPath, 'utf-8')
  const parsedConfigObject = ini.parse(iniContent)
  // TODO: Validate parsed configObject to verify that it has the correct structure
  if (Object.keys(parsedConfigObject).length === 0) {
    return defaultConfigObject
  }
  return parsedConfigObject as ConfigObject
}

export {
  addRoom,
  setRoomInFocus,
  setConnectionInFocus,
  listRooms,
  connectionInFocusId,
  roomInFocusId,
}
