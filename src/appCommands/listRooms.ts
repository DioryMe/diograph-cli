import { listRooms } from '../configManager.js'

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

export { outputListRooms }
