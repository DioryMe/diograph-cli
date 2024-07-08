# Diograph CLI

## Config

Application state is saved to `.dcli` file in home folder

- Connected rooms
- Room in focus
- FFMPEG_PATH
- S3 credentials

## Creating a room

Create room to /tmp folder and save app state to ./tmp/app-data.json

```
mkdir ./tmp
mkdir ./tmp/room
mkdir ./tmp/room/Diory\ Content
dcli room create ./tmp
```

Import image diory to that room

```
dcli import file ~/MyPictures/my-pic.jpg
```

## Tests

Running inside container ensures clean initial state and prevents unwanted side effects to local environment.

```
docker build -t robot-tests .
docker run robot-tests
```

## Troubleshooting

```
# PermissionError: [Errno 13] Permission denied: 'dcli'
chmod +x ~/.nvm/versions/node/v20.10.0/bin/dcli
```

```
# [Error: ENOENT: no such file or directory, open '/Diory Content/Mary/PIXNIO-53799-6177x4118.jpeg']
sed -i '' 's|"/Diory Content",|"'$(pwd)'/tests/demo-content-room/Diory Content",|g' tests/demo-content-room/room.json
```

## App commands

Use `dcli help` and `dcli room add --help` for full list of commands and options.

```

status
- shows room in focus and connection in focus

list rooms
- list available rooms in the app

list connections
- list available connections in the app

room focus <roomId>
- set given room into focus

room create <address>
- create new room to given path
- set it in focus
- set its connection in focus
- saves room info to config file

room add <address>
- add existing room into app and set it in focus

room remove <room-id>
- NOT IMPLEMENTED YET!
- removes room info from config file
- doesn't delete any files or folders

room destroy <room-id>
- NOT IMPLEMENTED YET!
- same as room remove but also deletes files and folders
  - including Diory Content connection

connection create <address>
- connect given folder
- set connection in focus
- saves connection info to the room in focus

connection list-contents <connectionAddress>
- generate diograph for the connection from folder contents

connection focus <connectionAddress>
- NOT IMPLEMENTED YET!
- set given connection in focus

connection remove <connectionAddress>
- NOT IMPLEMENTED YET!
- deletes all the information about the connection
- connection doesn't have destroy as it is either
  - part of the room (=diory contents) or
  - something we shouldn't touch (=user's personal photos)

diory query --all
- NOT IMPLEMENTED YET!
- show all diories in room in focus

diory query --all --useConnectionInFocus
- NOT IMPLEMENTED YET!
- show all diories in connection in focus

import file <filePath> --copyContent
- generate diory from given file contents
- add content to room in focus native connection
- link it to the root diory of the room in focus

import folder <folderPath>
- generate diograph from given folder structure
- add diograph to room in focus

copy <fromDioryId> <toDioryId>
- copy diory from one room or connection to another room
- link the newly created diory to toDiory
- copy fromDiory content to destination room's native connection

export content <CID> <destinationPath>
- NOT IMPLEMENTED YET!
- reads buffer of the content from connection wherever it is available for the app
- write given content to disk with chosen fileName
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
