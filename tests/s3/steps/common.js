const { existsSync, readFileSync, rmSync, mkdirSync, readdirSync, lstatSync } = require('fs')
const assert = require('assert')
const { join } = require('path')
const { Given, When, Then } = require('@cucumber/cucumber')
const { App } = require('../../../dist/testApp/test-app')
const { S3Client } = require('@diograph/s3-client')

const CONTENT_SOURCE_FOLDER = join(process.cwd(), 'demo-content-room', 'source')
const APP_DATA_PATH = join(process.cwd(), 'tmp')

const TEST_BUCKET_NAME = 'jvalanen-diory-test3'
const TEST_ROOM_KEY = '/'
const CONTENT_FOLDER_KEY = 'DioryContent/'
const TEST_ROOM_FULL_URL = `s3://${join(TEST_BUCKET_NAME, TEST_ROOM_KEY)}`
// const CONTENT_FOLDER_FULL_URL = `s3://${join(TEST_BUCKET_NAME, TEST_ROOM_KEY, CONTENT_FOLDER_KEY)}`

const testApp = new App()
const client = new S3Client(TEST_ROOM_FULL_URL)

Given('I have empty place for room', async () => {
  await testApp.init()
  await testApp.run('deleteRoom')

  existsSync(join(APP_DATA_PATH, 'app-data.json')) &&
    (await rmSync(join(APP_DATA_PATH, 'app-data.json')))
  if (!existsSync(APP_DATA_PATH)) {
    mkdirSync(APP_DATA_PATH)
  }

  const contentFolderExists = await client.exists(CONTENT_FOLDER_KEY)
  if (contentFolderExists) {
    await client.deleteFolder(CONTENT_FOLDER_KEY)
  }
})

// WHEN

When('I initiate a room', async () => {
  // If room already exists, this connects to it instead of initiating a new one
  await testApp.run('addRoom', TEST_ROOM_FULL_URL, 'S3Client')
})

When('I add connection to {word}', async (destination) => {
  let connectionAddress
  switch (destination) {
    case 'content-source-folder':
      connectionAddress = CONTENT_SOURCE_FOLDER
      break
    case 'DioryContent': // <-- currently not in use, created automatically in addRoom
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

/*
When('I delete room', async () => {
  await testApp.run('deleteRoom')
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



When('I import last diory to first connection', async () => {
  await testApp.run('import', '/two-test-image.jpg')
})

When('I import last diory to first connection with content', async () => {
  await testApp.run('import', '/two-test-image.jpg', true)
})
*/

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
  assert(diograph.diograph, 'Invalid diograph.json, diograph not found')
  assert.equal(
    Object.values(diograph.diograph).length,
    dioryCount === 'no' ? 0 : parseInt(dioryCount, 10),
  )
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

/*
Then('{word} {word} exists in application support room', (fileName, doesOrNot) => {
  assert.equal(existsSync(join(APP_DATA_PATH, `${fileName}`)), doesOrNot === 'does')
})

Then('appData has {word} room(s)', (count) => {
  const appDataContents = readFileSync(join(APP_DATA_PATH, 'app-data.json'), { encoding: 'utf8' })
  const appData = JSON.parse(appDataContents)

  assert.equal(appData.rooms.length, parseInt(count, 10))
})



Then('content folder has {int} file(s)', (count) => {
  if (count === 0 && !existsSync(CONTENT_FOLDER_FULL_URL)) {
    return
  }
  const contentFileList =
    lstatSync(CONTENT_FOLDER_FULL_URL).isDirectory() && readdirSync(CONTENT_FOLDER_FULL_URL)
  assert.equal(contentFileList.length, count)
})

Then('I receive a diory', async () => {
  const testApp = new App()
  const response = await testApp.run('getDiory')
  assert.ok(response)
  assert.equal(response.id, 'some-diory-id')
  assert.equal(response.text, 'Root diory')
})


Then('last diory has {word} as {word}', (value, property) => {
  const diographContents = readFileSync(join(TEST_ROOM_KEY, 'diograph.json'), {
    encoding: 'utf8',
  })
  const diograph = JSON.parse(diographContents)
  assert(diograph.diograph, 'Invalid diograph.json, diograph not found')
  const diories = Object.values(diograph.diograph)
  const lastDiory = diories[diories.length - 1]

  if (property === 'contentUrl') {
    assert.equal(lastDiory.data[0].contentUrl, value)
  } else if (property === 'encodingFormat') {
    assert.equal(lastDiory.data[0].encodingFormat, value)
  }
})
*/
