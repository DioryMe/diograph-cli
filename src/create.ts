const create = (subcommand: string) => {
  if (subcommand == 'room') {
    createRoom()
    return
  }

  if (subcommand == 'connection') {
    createConnection()
    return
  }

  if (subcommand == 'diory') {
    createDiory()
    return
  }

  console.log(`Unknown subcommand ${subcommand}, should have been room, connection or diory`)
}

const createDiory = () => {
  console.log('No room in focus')
}

const createConnection = () => {
  console.log('No room in focus')
}

const createRoom = () => {
  console.log('this is create room')
  /*
  const roomPath = arg1
  const contentClientType = arg2 || 'LocalClient'

  // Verify
  if (!roomPath) {
    throw new Error('Arg1 (=roomPath) not provided for createRoom(), please provide one')
  }

  if (!['LocalClient', 'S3Client'].includes(contentClientType)) {
    throw new Error(`createRoom error: contentClient type should be either LocalClient or S3Client`)
  }
  if (this.rooms.find((existingRoom) => existingRoom.address === roomPath)) {
    throw new Error(`createRoom error: Room with address ${roomPath} already exists`)
  }

  // Execute
  const room = await createRoom(roomPath, contentClientType)

  // Add room to app
  this.rooms.push(room)

  // Set room in focus
  const { roomInFocus, connectionInFocus } = await setRoomInFocus(
    this.rooms,
    this.rooms.length - 1,
    APP_DATA_PATH,
  )
  this.roomInFocus = roomInFocus
  this.connectionInFocus = connectionInFocus

  console.log('Room added.')

  return
  */
}

export { create, createRoom, createDiory }
