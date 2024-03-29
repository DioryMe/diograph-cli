import { listRooms } from '../configManager.js'

const outputListRooms = async (): Promise<void> => {
  const rooms = await listRooms()
  console.log(generateOutput(rooms))
}

// TODO: Generate table output with column headers
const generateOutput = (rooms: object): string => {
  return Object.values(rooms)
    .map((room, i) => `${i}: ${room.address} - ${room.roomClientType}`)
    .join('\n')
}

export { outputListRooms }
