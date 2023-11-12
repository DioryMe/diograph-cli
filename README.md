# Diograph CLI

## Usage

Create room to /tmp folder and save app state to ./tmp/app-data.json

```
APP_DATA_PATH=./tmp/app-data.json node ./testApp/test-cli.js createRoom ./tmp
```

Import image diory to that room

```
APP_DATA_PATH=./tmp/app-data.json node ./testApp/test-cli.js importDiory ~/MyPictures/my-pic.jpg
```

## Tests

NOTE: You may want to remove APP_DATA_PATH before running tests

Local:

```
yarn test
```

S3:

```
DIOGRAPH_CLI_TEST_TYPE=S3 aws-vault exec ***** -- yarn test
```

## App commands

```
dryRun
- runs app and exits without doing anything

resetApp()
- removes App data (=app-data.json)

status()
- shows app-data path, room in focus, connection in focus

listRooms (or listAppRooms)
- list available rooms in the app

setRoomInFocus(roomIndex)
- set room with given into focus in app

setConnectionInFocus(connectionIndex)
- set connection with given into focus in app

getDiograph()
- show room in focus diograph contents

listAppConnections()
- list all the available connections in the app

listConnections()
- list available connections in the room in focus

getConnectionDiograph()
- show connection in focus diograph contents

createRoom(roomPath)
- adds room to given path
- creates LocalClient, RoomClient and Room
- saves room address to app-data
- e.g. ... createRoom /room/folder

removeRoom()
- removes room from app-data
- doesn't delete any files or folders

writeFileFromContent(contentId, fileName)
- write given content to disk with chosen fileName
```

## Room commands

```
listConnections() (or listRoomConnections)
- list connections of room in focus

deleteRoom()
- remove room.json and diograph.json from the room path
- remove it also from app-data

removeConnection()
- removes connection from room.json
- set other connection to focus in app

deleteConnection()
- removes the connection folder contents (=`rm -rf`)
- removes connection from room.json
- set other connection to focus in app

createConnection(connectionPath)
- create connection to given (or current) path
- add for room in focus
- e.g. ... createConnection /path/to/source/folder

importDioryFromFile
- copy file to appTempFolder
- generateDioryFromFile
- add diory to room (in focus) diograph
- add content to room (in focus) native connection

copyDioryFromRoom(shouldCopyContent)
- add diory in focus in connection's diograph to room
- add diory's content to room in focus (+ change contentUrl?)

importDioryFromContentSource(connectionInternalPathId, copyContent)
- copy diory (and content) from connection to room
- boolean to define if content should be made available also on native-connection
- e.g. ... import /two-test-image.jpg true

readContent(contentUrl)
- reads buffer of the content from connection where it is available

listConnectionContents
- uses listContentSource tool to list contents (in diograph)
- should be: list content source contents
- e.g. ... listConnectionContents
  - currently lists contents of the second connection in the room
  - should this return something?
```

## Diograph commands

```
getDiograph
getDiory
createDiory
deleteDiory
```

## App data

Stores room addresses (and in the future possibly other app-specific data)

app-data.json example:

```
{
  "roomInFocus": "/diograph-cli/tmp"
  "connectionInFocus": "/diograph-cli/tmp/Diory Content"
  "rooms": [
    {
      "address": "/diograph-cli/tmp"
    }
  ]
}
```
