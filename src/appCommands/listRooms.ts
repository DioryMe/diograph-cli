import fs from 'fs'
import ini from 'ini'
import { dcliConfigPath } from '../config.js'

interface ConfigObject {
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

const readConfig = (configPath: string): ConfigObject => {
  const iniContent = fs.readFileSync(configPath, 'utf-8')
  const parsedConfigObject = ini.parse(iniContent)
  // TODO: Validate parsed configObject to verify that it has the correct structure
  return parsedConfigObject as ConfigObject
}

const listRooms = (): object => {
  const configObject: ConfigObject = readConfig(dcliConfigPath)
  return configObject.rooms
}

const outputListRooms = (): void => {
  const rooms = listRooms()
  console.log(generateOutput(rooms))
}

// TODO: Generate table output with column headers
const generateOutput = (rooms: object): string => {
  return Object.values(rooms)
    .map((room, i) => `${i}: ${room.address} - ${room.roomClientType}`)
    .join('\n')
}

export { outputListRooms, listRooms }
