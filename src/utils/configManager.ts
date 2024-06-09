import fs from 'fs/promises'
import ini from 'ini'
import { dcliConfigPath } from './appConfig.js'
import { Connection, Room } from '@diograph/diograph'
import { constructAndLoadRoom } from '@diograph/diograph'
import { S3ClientCredentials } from '@diograph/s3-client'
import { getAvailableClients } from './getAvailableClients.js'
import { RoomConfigData } from '@diograph/diograph/types'
import { validateRoomConfigData } from '@diograph/diograph/validator'

export interface ConfigObject {
  focus: {
    connectionInFocus: string
    roomInFocus: string
  }
  rooms: {
    [key: string]: RoomConfigData
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
  const roomId = `room-${Object.keys(configObject.rooms).length + 1}`
  configObject.rooms[roomId] = {
    id: roomId,
    address: roomAddress,
    clientType: roomClientType,
  }
  await writeConfig(configObject)
}

const setRoomInFocus = async (roomAddress: string): Promise<void> => {
  const configObject = await readConfig()

  const room = Object.values(configObject.rooms).find((room) => room.address === roomAddress)

  if (!room || !room.id) {
    throw new Error(`Can't set roomInFocus: ${roomAddress} not found`)
  }

  configObject.focus.roomInFocus = room.id
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

const connectionInFocus = async (): Promise<Connection> => {
  const roomId = await roomInFocusId()
  const roomConfig = (await listRooms())[roomId]

  const availableClients = await getAvailableClients()
  const room = await constructAndLoadRoom(
    roomConfig.address,
    roomConfig.clientType,
    availableClients,
  )

  const connectionAddress = await connectionInFocusAddress()

  const connection = room.findConnection(connectionAddress)

  if (!connection) {
    throw new Error('ConnectionInFocus not found from RoomInFocus!??!')
  }

  return connection
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
  const roomConfig = (await listRooms())[roomId]

  const availableClients = await getAvailableClients()
  const room = constructAndLoadRoom(roomConfig.address, roomConfig.clientType, availableClients)
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
const findRoom = async (roomAddress: string): Promise<RoomConfigData> => {
  const configObject = await readConfig()

  if (Object.keys(configObject.rooms).length === 0) {
    throw new Error('No rooms found')
  }

  const roomConfig = Object.values(configObject.rooms).find((room) => room.address === roomAddress)

  if (!roomConfig) {
    throw new Error(`Room with address ${roomAddress} not found`)
  }

  return roomConfig
}

const readConfig = async (): Promise<ConfigObject> => {
  const iniContent = await fs.readFile(dcliConfigPath, 'utf-8')
  const parsedConfigObject = ini.parse(iniContent)

  // TODO: Validate parsed configObject to verify that it has the correct structure
  // - s3Credentials should be type @diograph/s3-client/S3ClientCredentials

  if (Object.keys(parsedConfigObject).length === 0) {
    return defaultConfigObject
  }

  if (!parsedConfigObject.rooms) {
    parsedConfigObject.rooms = {}
  }

  // Validate RoomConfigData
  Object.values(parsedConfigObject.rooms).forEach((parsedRoomConfigDataObject) => {
    validateRoomConfigData(parsedRoomConfigDataObject as RoomConfigData)
  })

  return parsedConfigObject as ConfigObject
}

const writeConfig = async (configObject: ConfigObject): Promise<void> => {
  // TODO: Validate configObject to verify that it has the correct structure before writing it to file
  // - s3Credentials should be type @diograph/s3-client/S3ClientCredentials

  // Validate RoomConfigData before writing it to file
  Object.values(configObject.rooms).forEach((roomConfigDataObject: RoomConfigData) => {
    validateRoomConfigData(roomConfigDataObject)
  })

  await fs.writeFile(dcliConfigPath, ini.stringify(configObject))
  console.log(`Configuration written to: ${dcliConfigPath}`)
}

export {
  addRoom,
  setRoomInFocus,
  setConnectionInFocus,
  listRooms,
  connectionInFocusAddress,
  connectionInFocus,
  roomInFocusId,
  roomInFocus,
  setFfmpegPath,
  getFfmpegPath,
  setS3Credentials,
  getS3Credentials,
}
