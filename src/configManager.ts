import fs from 'fs/promises'
import ini from 'ini'
import { dcliConfigPath } from './appConfig.js'

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

const addRoom = async (roomAddress: string, roomClientType: string): Promise<void> => {
  const configObject = await readConfig()
  configObject.rooms[roomAddress] = {
    address: roomAddress,
    roomClientType: roomClientType,
  }
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

const readConfig = async (): Promise<ConfigObject> => {
  const iniContent = await fs.readFile(dcliConfigPath, 'utf-8')
  const parsedConfigObject = ini.parse(iniContent)
  // TODO: Validate parsed configObject to verify that it has the correct structure
  return parsedConfigObject as ConfigObject
}

export { addRoom, listRooms, connectionInFocusId, roomInFocusId }
