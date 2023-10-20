const { existsSync, rmSync, mkdirSync } = require('fs')
const assert = require('assert')
const { join } = require('path')
const { Given, When, Then } = require('@cucumber/cucumber')
const { App } = require('../../dist/testApp/test-app')
const { S3Client } = require('@diograph/s3-client')
const { LocalClient } = require('@diograph/local-client')
const { readFile } = require('fs/promises')

const APP_DATA_PATH = join(process.cwd(), 'tmp')
const CONTENT_SOURCE_FOLDER = join(process.cwd(), 'demo-content-room', 'source')
const testType = process.env['DIOGRAPH_CLI_TEST_TYPE'] || 'local'

function localClientVars() {
  const TEST_ROOM_FULL_URL = join(APP_DATA_PATH, 'room')
  const TEST_ROOM2_FULL_URL = join(APP_DATA_PATH, 'room2')
  const TEST_ROOM_NATIVE_CONNECTION_URL = join(APP_DATA_PATH, 'room', 'Diory Content')
  const TEST_ROOM2_NATIVE_CONNECTION_URL = join(APP_DATA_PATH, 'room2', 'Diory Content')
  const CONTENT_FOLDER_FULL_URL = join(APP_DATA_PATH, 'ContentFolder')
  const CONTENT_FOLDER2_FULL_URL = join(APP_DATA_PATH, 'ContentFolder')

  const testApp = new App()
  const client = new LocalClient(TEST_ROOM_FULL_URL)
  const connectionClient = new LocalClient(TEST_ROOM_NATIVE_CONNECTION_URL)
  const client2 = new LocalClient(TEST_ROOM2_FULL_URL)
  const connectionClient2 = new LocalClient(TEST_ROOM2_NATIVE_CONNECTION_URL)

  return {
    testApp,
    client,
    connectionClient,
    client2,
    connectionClient2,
    TEST_ROOM_FULL_URL,
    TEST_ROOM2_FULL_URL,
    TEST_ROOM_NATIVE_CONNECTION_URL,
    TEST_ROOM2_NATIVE_CONNECTION_URL,
    CONTENT_FOLDER_FULL_URL,
    CONTENT_FOLDER2_FULL_URL,
    resetContentFolder: async () => {
      // TODO: Execute this via client.deleteFolder
      existsSync(CONTENT_FOLDER_FULL_URL) && rmSync(CONTENT_FOLDER_FULL_URL, { recursive: true })
    },
  }
}

function s3ClientVars() {
  const TEST_BUCKET_NAME = 'jvalanen-diory-test3'
  const TEST_ROOM_KEY = 'room'
  const TEST_ROOM2_KEY = 'room2'
  // This MUST end with / in order to client.deleteFolder to succeed...
  const CONTENT_FOLDER_KEY = 'ContentFolder'
  const NATIVE_CONNECTION_FOLDER_KEY = 'Diory Content'
  const TEST_ROOM_FULL_URL = `s3://${join(TEST_BUCKET_NAME, TEST_ROOM_KEY)}/`
  const TEST_ROOM2_FULL_URL = `s3://${join(TEST_BUCKET_NAME, TEST_ROOM2_KEY)}/`
  const TEST_ROOM_NATIVE_CONNECTION_URL = `s3://${join(
    TEST_BUCKET_NAME,
    TEST_ROOM_KEY,
    NATIVE_CONNECTION_FOLDER_KEY,
  )}/`
  const TEST_ROOM2_NATIVE_CONNECTION_URL = `s3://${join(
    TEST_BUCKET_NAME,
    TEST_ROOM2_KEY,
    NATIVE_CONNECTION_FOLDER_KEY,
  )}/`
  const CONTENT_FOLDER_FULL_URL = `s3://${join(TEST_BUCKET_NAME, CONTENT_FOLDER_KEY)}/`
  const CONTENT_FOLDER2_FULL_URL = `s3://${join(TEST_BUCKET_NAME, CONTENT_FOLDER_KEY)}/`

  const testApp = new App()
  const client = new S3Client(TEST_ROOM_FULL_URL)
  const connectionClient = new S3Client(TEST_ROOM_NATIVE_CONNECTION_URL)
  const client2 = new S3Client(TEST_ROOM2_FULL_URL)
  const connectionClient2 = new S3Client(TEST_ROOM2_NATIVE_CONNECTION_URL)

  return {
    testApp,
    client,
    connectionClient,
    client2,
    connectionClient2,
    TEST_ROOM_FULL_URL,
    TEST_ROOM2_FULL_URL,
    TEST_ROOM_NATIVE_CONNECTION_URL,
    TEST_ROOM2_NATIVE_CONNECTION_URL,
    CONTENT_FOLDER_FULL_URL,
    CONTENT_FOLDER2_FULL_URL,
    resetContentFolder: () => client.deleteFolder(CONTENT_FOLDER_KEY),
  }
}

const {
  testApp,
  client,
  connectionClient,
  client2,
  connectionClient2,
  TEST_ROOM_FULL_URL,
  TEST_ROOM2_FULL_URL,
  TEST_ROOM_NATIVE_CONNECTION_URL,
  TEST_ROOM2_NATIVE_CONNECTION_URL,
  CONTENT_FOLDER_FULL_URL,
  CONTENT_FOLDER2_FULL_URL,
  resetContentFolder,
} = testType == 'S3' ? s3ClientVars() : localClientVars()

Given('I have empty place for room', async () => {
  // Load app-data.json
  await testApp.init()

  // Delete rooms
  await testApp.run('removeRoom')
  await testApp.run('removeRoom')
  await testApp.run('removeRoom')

  // Delete app-data.json
  existsSync(join(APP_DATA_PATH, 'app-data.json')) &&
    (await rmSync(join(APP_DATA_PATH, 'app-data.json')))
  if (!existsSync(APP_DATA_PATH)) {
    mkdirSync(APP_DATA_PATH)
  }

  // Prepare room and nativeConnection folders
  if (testType == 'local') {
    if (!existsSync(TEST_ROOM_FULL_URL)) {
      mkdirSync(TEST_ROOM_FULL_URL)
    }
    if (!existsSync(TEST_ROOM_NATIVE_CONNECTION_URL)) {
      mkdirSync(TEST_ROOM_NATIVE_CONNECTION_URL)
    }
    if (!existsSync(TEST_ROOM2_FULL_URL)) {
      mkdirSync(TEST_ROOM2_FULL_URL)
    }
    if (!existsSync(TEST_ROOM2_NATIVE_CONNECTION_URL)) {
      mkdirSync(TEST_ROOM2_NATIVE_CONNECTION_URL)
    }
  }

  await resetContentFolder()
})

// WHEN

When('I call {word} operation', async (operation) => {
  await testApp.run(operation)
})

When('I call {word} operation with {string}', async (operation, argument) => {
  await testApp.run(operation, argument)
})

When('I createConnection {string}', async (argument) => {
  let connectionAddress
  switch (argument) {
    case 'CONTENT_SOURCE_CONNECTION':
      connectionAddress = CONTENT_SOURCE_FOLDER
      break
    case 'SECOND_NATIVE_CONNECTION':
      connectionAddress = SECOND_NATIVE_CONNECTION
    case 'DioryContent': // <-- currently not in use, created automatically in createRoom
      connectionAddress = CONTENT_FOLDER_FULL_URL
      break
    default:
      break
  }

  // TODO: Do this via client & allow using/testing S3 connection
  // if (!existsSync(connectionAddress)) {
  //   throw new Error(`ERROR: connectionAddress not found ${connectionAddress}`)
  // }

  await testApp.run('createConnection', connectionAddress)
})

When('I createRoom {string}', async (argument) => {
  let roomPath
  if (argument == 'DEFAULT_TEST_ROOM') {
    roomPath = TEST_ROOM_FULL_URL
  } else if (argument == 'SECOND_TEST_ROOM') {
    roomPath = TEST_ROOM2_FULL_URL
  } else {
    throw new Error('Unknown roomPath when calling createRoom operation')
  }
  await testApp.run('createRoom', roomPath, testType == 'S3' ? 'S3Client' : 'LocalClient')
})

When('I import last diory to first connection', async () => {
  await testApp.run('import', '/two-test-image.jpg')
})

When('I call importDioryFromFile', async () => {
  const imageFilePath = join(
    APP_DATA_PATH,
    '..',
    'demo-content-room',
    'source',
    'one-test-image.jpg',
  )
  await testApp.run('importDioryFromFile', imageFilePath)
})

When('I call importDioryFromFile with content', async () => {
  const imageFilePath = join(
    APP_DATA_PATH,
    '..',
    'demo-content-room',
    'source',
    'one-test-image.jpg',
  )
  await testApp.run('importDioryFromFile', imageFilePath, true)
})

// THEN

Then('{string} {word} exist(s)', async (fileName, doesOrNot) => {
  if (fileName == 'DEFAULT_TEST_ROOM') {
    const existsResponse = await client.exists('')
    assert.equal(existsResponse, doesOrNot === 'does')
  } else if (fileName == 'DEFAULT_NATIVE_CONNECTION') {
    const existsResponse = await connectionClient.exists('')
    assert.equal(existsResponse, doesOrNot === 'does')
  } else if (fileName == 'SECOND_NATIVE_CONNECTION') {
    const existsResponse = await connectionClient2.exists('')
    assert.equal(existsResponse, doesOrNot === 'does')
  } else {
    const existsResponse = await client.exists(fileName)
    assert.equal(existsResponse, doesOrNot === 'does')
  }
})

Then('room.json has {word} connection(s)', async (clientCount) => {
  const roomJsonContents = await client.readTextItem('room.json')
  const roomJson = JSON.parse(roomJsonContents)
  assert(roomJson.connections, 'Invalid room.json, connections not found')
  assert.equal(roomJson.connections.length, clientCount === 'no' ? 0 : parseInt(clientCount, 10))
})

Then('diograph.json has {word} diories', async (dioryCount) => {
  const diographContents = await client.readTextItem('diograph.json')
  const diograph = JSON.parse(diographContents)
  assert.equal(Object.values(diograph).length, dioryCount === 'no' ? 0 : parseInt(dioryCount, 10))
})

Then('app-data.json has {word} rooms', async (roomCount) => {
  // Parse app-data.json
  const appDataPath = join(APP_DATA_PATH, 'app-data.json')
  if (!existsSync(appDataPath)) {
    throw new Error("Couldn't find app-data.json...")
  }
  const appDataContents = await readFile(appDataPath, { encoding: 'utf8' })
  const appData = JSON.parse(appDataContents)

  assert.equal(appData.rooms.length, roomCount === 'no' ? 0 : parseInt(roomCount, 10))
})

Then('app-data.json has {string} as {word}', async (constantName, property) => {
  // Parse app-data.json
  const appDataPath = join(APP_DATA_PATH, 'app-data.json')
  if (!existsSync(appDataPath)) {
    throw new Error("Couldn't find app-data.json...")
  }
  const appDataContents = await readFile(appDataPath, { encoding: 'utf8' })
  const appData = JSON.parse(appDataContents)

  // Convert constantName to value
  let value
  if (constantName == 'DEFAULT_TEST_ROOM') {
    value = TEST_ROOM_FULL_URL
  } else if (constantName == 'DEFAULT_NATIVE_CONNECTION') {
    value = TEST_ROOM_NATIVE_CONNECTION_URL
  } else if (constantName == 'SECOND_TEST_ROOM') {
    value = TEST_ROOM2_FULL_URL
  } else if (constantName == 'SECOND_NATIVE_CONNECTION') {
    value = TEST_ROOM2_NATIVE_CONNECTION_URL
  } else if (constantName == 'CONTENT_SOURCE_CONNECTION') {
    value = CONTENT_SOURCE_FOLDER
  } else {
    throw new Error('Unknown constantName when checking app-data.json contents')
  }
  assert.equal(appData[property], value)
})

// TODO: Use connection in focus & app commands instead of parsing the room.json manually?
Then('last connection diograph has {int} diories', async (dioryCount) => {
  const roomJsonContents = await client.readTextItem('room.json')
  const roomJson = JSON.parse(roomJsonContents)
  const lastConnection = roomJson.connections[roomJson.connections.length - 1]

  const diories = Object.values(lastConnection.diograph)
  assert.equal(diories.length, dioryCount)
})

// TODO: Use connection in focus & app commands instead of parsing the room.json manually?
Then('last connection has {int} contentUrls', async (value) => {
  const roomJsonContents = await client.readTextItem('room.json')
  const roomJson = JSON.parse(roomJsonContents)
  const lastConnection = roomJson.connections[roomJson.connections.length - 1]

  assert.equal(Object.values(lastConnection.contentUrls).length, value)
})

Then('I get url from getContent with {string}', async (contentId) => {
  const response = await testApp.run('getContent', contentId)
  assert.ok(response, "getContent() didn't return anything")
})

Then('content folder has {int} file(s)', async (count) => {
  const list = await connectionClient.list('')
  assert.equal(list.length, count)
})

Then('last diory has {word} as {word}', async (value, property) => {
  const diographContents = await client.readTextItem('diograph.json')

  const diograph = JSON.parse(diographContents)
  const diories = Object.values(diograph)
  const lastDiory = diories[diories.length - 1]

  if (property === 'contentUrl') {
    assert.equal(lastDiory.data[0].contentUrl, value)
  } else if (property === 'encodingFormat') {
    assert.equal(lastDiory.data[0].encodingFormat, value)
  }
})
