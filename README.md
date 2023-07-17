# Diograph CLI

## Usage

Create room to /tmp folder and save app state to ./tmp/app-data.json

```
APP_DATA_PATH=./tmp/app-data.json node ./testApp/test-cli.js addRoom ./tmp
```

Import image diory to that room

```
APP_DATA_PATH=./tmp/app-data.json node ./testApp/test-cli.js importDiory ~/MyPictures/my-pic.jpg
```

## TODO

```
- Connection in focus (currently always second in the room)
- Diory in focus (both: room's & connection's diograph)
```

## App commands

```
dryRun
- runs app and exists without error without doing anything

resetApp()
- removes App data (=app-data.json)

addRoom(roomPath)
- adds room to given path
- creates LocalClient, RoomClient and Room
- saves room address to app-data
- e.g. ... addRoom /room/folder

listRooms (or listAppRooms)
- list available rooms in the app

listAppConnections()
- list all the available connections in the app

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

addConnection(connectionPath)
- add connection to given (or current) path
- add for room in focus
- e.g. ... addConnection /path/to/source/folder

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

getContent(contentUrl)
- returns url for the content (room address + contentUrl)

listClientContents
- uses listContentSource tool to list contents (in diograph)
- should be: list content source contents
- e.g. ... listClientContents
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
