import fs from 'fs/promises'
import ini from 'ini'
import { dcliConfigPath } from './appConfig.js'
import { Room } from '@diograph/diograph'
import { LocalClient } from '@diograph/local-client'
import { constructAndLoadRoom } from '@diograph/utils'
import { S3ClientCredentials } from '@diograph/s3-client'
import { getAvailableClients } from './getAvailableClients.js'

export interface RoomConfig {
  address: string
  roomClientType: string
}

export interface ConfigObject {
  focus: {
    connectionInFocus: string
    roomInFocus: string
  }
  rooms: {
    [key: string]: RoomConfig
  }
  ffmpegPath?: string
  s3Credentials?: S3ClientCredentials
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

const listRooms = async () => {
  const configObject = await readConfig()
  return configObject.rooms
}

const connectionInFocusAddress = async (): Promise<string> => {
  const configObject = await readConfig()

  if (!configObject.focus.connectionInFocus) {
    throw new Error('No connectionInFocus defined in config file')
  }

  return configObject.focus.connectionInFocus
}

const roomInFocusId = async (): Promise<string> => {
  const configObject = await readConfig()

  if (!configObject.focus.roomInFocus) {
    throw new Error('No roomInFocus defined in config file')
  }

  return configObject.focus.roomInFocus
}

const roomInFocus = async (): Promise<Room> => {
  const roomId = await roomInFocusId()
  const roomConfig = await findRoom(roomId)

  const availableClients = await getAvailableClients()
  const room = constructAndLoadRoom(roomConfig.address, roomConfig.roomClientType, availableClients)
  return room
}

const setFfmpegPath = async (ffmpegPath: string): Promise<void> => {
  const configObject = await readConfig()
  configObject.ffmpegPath = ffmpegPath
  await writeConfig(configObject)
}

const getFfmpegPath = async (): Promise<string> => {
  const configObject = await readConfig()

  if (!configObject.ffmpegPath) {
    throw new Error('No ffmpegPath defined in config file')
  }

  return configObject.ffmpegPath
}

const setS3Credentials = async (credentials: S3ClientCredentials): Promise<void> => {
  const configObject = await readConfig()
  configObject.s3Credentials = credentials
  await writeConfig(configObject)
}

const getS3Credentials = async (): Promise<S3ClientCredentials> => {
  const configObject = await readConfig()

  if (!configObject.s3Credentials) {
    throw new Error('No s3Credentials defined in config file')
  }

  return configObject.s3Credentials
}

// private

// TODO: Credentials missing here...
const findRoom = async (roomAddress: string): Promise<RoomConfig> => {
  const configObject = await readConfig()

  if (Object.keys(configObject.rooms).length === 0) {
    throw new Error('No rooms found')
  }

  if (!configObject.rooms[roomAddress]) {
    throw new Error(`Room with address ${roomAddress} not found`)
  }

  return configObject.rooms[roomAddress]
}

const readConfig = async (): Promise<ConfigObject> => {
  const iniContent = await fs.readFile(dcliConfigPath, 'utf-8')
  const parsedConfigObject = ini.parse(iniContent)

  // TODO: Validate parsed configObject to verify that it has the correct structure
  // - s3Credentials should be type @diograph/s3-client/S3ClientCredentials

  if (Object.keys(parsedConfigObject).length === 0) {
    return defaultConfigObject
  }
  return parsedConfigObject as ConfigObject
}

const writeConfig = async (configObject: ConfigObject): Promise<void> => {
  // TODO: Validate configObject to verify that it has the correct structure before writing it to file
  // - s3Credentials should be type @diograph/s3-client/S3ClientCredentials

  await fs.writeFile(dcliConfigPath, ini.stringify(configObject))
  console.log(`Configuration written to: ${dcliConfigPath}`)
}

export {
  addRoom,
  setRoomInFocus,
  setConnectionInFocus,
  listRooms,
  connectionInFocusAddress,
  roomInFocusId,
  roomInFocus,
  constructAndLoadRoom,
  setFfmpegPath,
  getFfmpegPath,
  setS3Credentials,
  getS3Credentials,
}
