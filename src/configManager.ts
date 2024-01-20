import fs from 'fs'
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

const listRooms = () => {
  const configObject = readConfig()
  return configObject.rooms
}

const connectionInFocusId = (): string => {
  const configObject = readConfig()
  return configObject.focus.connectionInFocus
}

const roomInFocusId = (): string => {
  const configObject = readConfig()
  return configObject.focus.roomInFocus
}

const readConfig = (): ConfigObject => {
  const iniContent = fs.readFileSync(dcliConfigPath, 'utf-8')
  const parsedConfigObject = ini.parse(iniContent)
  // TODO: Validate parsed configObject to verify that it has the correct structure
  return parsedConfigObject as ConfigObject
}

export { listRooms, connectionInFocusId, roomInFocusId }
