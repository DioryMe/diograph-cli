# Diograph CLI

## TODO

```
- Room in focus (currently always first room)
- Connection in focus (currently always second in the room)
- Diory in focus (both: room's & connection's diograph)
```

## Docs

```
APP_DATA_PATH = app-data.json
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

appListRooms
- list available rooms in the app

listConnections()
- list all the available connections in the app
- should be: appListConnections
```

## Room commands

```
roomListConnections()
- list room's connections
- currently first room of the appListRoomsas there's

deleteRoom()
- remove room.json and diograph.json from the room path
- remove it also from app-data

addConnection(connectionPath)
- add connection to given (or current) path
- currently to first room
- e.g. ... addConnection /path/to/source/folder

importDioryFromFile
- copy file to appTempFolder
- generateDioryFromFile
- add diory to room (in focus) diograph
- add content to room (in focus) native connection

addDioryToRoom(shouldCopyContent)
- add diory in focus in connection's diograph to room
- add diory's content to room in focus (+ change contentUrl?)

import
- copy diory (and content) from connection to room
- boolean to define if content should be made available also on native-connection
- e.g. ... import /two-test-image.jpg true
```

## Connection commands

```
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
  "rooms": [
    {
      "address": "/Users/Jouni/Code/diograph-cli/tmp"
    }
  ]
}
```
