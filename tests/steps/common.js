const { existsSync, rmSync, mkdirSync } = require('fs')
const assert = require('assert')
const { join } = require('path')
const { Given, When, Then } = require('@cucumber/cucumber')
const { App } = require('../../dist/testApp/test-app')
const { S3Client } = require('@diograph/s3-client')
const { LocalClient } = require('@diograph/local-client')

const APP_DATA_PATH = join(process.cwd(), 'tmp')
const CONTENT_SOURCE_FOLDER = join(process.cwd(), 'demo-content-room', 'source')
const testType = process.env['DIOGRAPH_CLI_TEST_TYPE']

function localClientVars() {
  const TEST_ROOM_FULL_URL = APP_DATA_PATH
  const CONTENT_FOLDER_FULL_URL = join(TEST_ROOM_FULL_URL, 'Diory Content')

  const testApp = new App()
  const client = new LocalClient(TEST_ROOM_FULL_URL)
  const connectionClient = new LocalClient(CONTENT_FOLDER_FULL_URL)

  return {
    testApp,
    client,
    connectionClient,
    TEST_ROOM_FULL_URL,
    CONTENT_FOLDER_FULL_URL,
    resetContentFolder: async () => {
      // TODO: Execute this via client.deleteFolder
      existsSync(CONTENT_FOLDER_FULL_URL) && rmSync(CONTENT_FOLDER_FULL_URL, { recursive: true })
    },
  }
}

function s3ClientVars() {
  const TEST_BUCKET_NAME = 'jvalanen-diory-test3'
  const TEST_ROOM_KEY = ''
  // This MUST end with / in order to client.deleteFolder to succeed...
  const CONTENT_FOLDER_KEY = 'Diory Content/'
  const TEST_ROOM_FULL_URL = `s3://${join(TEST_BUCKET_NAME, TEST_ROOM_KEY)}`
  const CONTENT_FOLDER_FULL_URL = `s3://${join(
    TEST_BUCKET_NAME,
    TEST_ROOM_KEY,
    CONTENT_FOLDER_KEY,
  )}`

  const testApp = new App()
  const client = new S3Client(TEST_ROOM_FULL_URL)
  const connectionClient = new S3Client(CONTENT_FOLDER_FULL_URL)

  return {
    testApp,
    client,
    connectionClient,
    TEST_ROOM_FULL_URL,
    CONTENT_FOLDER_FULL_URL,
    resetContentFolder: () => client.deleteFolder(CONTENT_FOLDER_KEY),
  }
}

const {
  testApp,
  client,
  connectionClient,
  TEST_ROOM_FULL_URL,
  CONTENT_FOLDER_FULL_URL,
  resetContentFolder,
} = testType == 'S3' ? s3ClientVars() : localClientVars()

Given('I have empty place for room', async () => {
  await testApp.init()
  await testApp.run('deleteRoom')

  existsSync(join(APP_DATA_PATH, 'app-data.json')) &&
    (await rmSync(join(APP_DATA_PATH, 'app-data.json')))
  if (!existsSync(APP_DATA_PATH)) {
    mkdirSync(APP_DATA_PATH)
  }

  await resetContentFolder()
})

// WHEN

When('I add connection to {word}', async (destination) => {
  let connectionAddress
  switch (destination) {
    case 'content-source-folder':
      connectionAddress = CONTENT_SOURCE_FOLDER
      break
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

  await testApp.run('addConnection', connectionAddress)
})

When('I call {word} operation', async (operation) => {
  await testApp.run(operation)
})

When('I call createRoom operation with {word}', async (argument) => {
  let roomPath
  if (argument == 'TEST_ROOM_FULL_URL') {
    roomPath = TEST_ROOM_FULL_URL
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

Then('{word} {word} exists', async (fileName, doesOrNot) => {
  const existsResponse = await client.exists(fileName)
  assert.equal(existsResponse, doesOrNot === 'does')
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
