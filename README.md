# Diograph CLI

## Install

```
npm install -g diograph-cli
```

## Tests

Running inside container ensures clean initial state and prevents unwanted side effects to local environment.

```
docker build -t robot-tests . && docker run robot-tests
```

## App commands

Use `dcli help` and `dcli room add --help` for full list of commands and options.

```

status
- shows room in focus and connection in focus

config set
- set config values: FFMPEG_PATH or s3-credentials
- `dcli config set s3-credentials "[ACCESS_KEY] [SECRET_KEY]"`
- `dcli config set FFMPEG_PATH /opt/homebrew/bin/ffmpeg`

list rooms
- list available rooms in the app

list connections
- list available connections in the app

room focus <roomId>
- set given room into focus

room create --address <address>
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

connection create --address <address>
- connect given folder
- set connection in focus
- saves connection info to the room in focus

connection list-contents <connectionAddress>
- generate diograph for the connection from folder contents

connection export --address <address>
- export connection in focus as room to given address
- NOTE: only necessary to be able to show it in diory-browser-electron

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

server
- launch web server to provide thumbnails and content via http
  - http://localhost:3000//room-1/thumbnail?dioryId=[dioryId]
  - http://localhost:3000/room-1/content?cid=[contentId]&mime=image/jpeg
```

## Diograph commands

```
diory query [options]
diory show <diory-id>
diory create <text> [id]
diory remove <id>
diory link <fromId> <toId>
diory unlink <fromId> <toId>
```

## Usage

See [tutorial.md](./docs/tutorial.md) for examples.

## Config

Application state is saved to `.dcli` file in home folder

- Rooms
- Room in focus
- FFMPEG_PATH
- S3 credentials

## Troubleshooting

```
# PermissionError: [Errno 13] Permission denied: 'dcli'
chmod +x ~/.nvm/versions/node/v20.10.0/bin/dcli
```

```
# [Error: ENOENT: no such file or directory, open '/Diory Content/Mary/PIXNIO-53799-6177x4118.jpeg']
sed -i '' 's|"/Diory Content",|"'$(pwd)'/tests/demo-content-room/Diory Content",|g' tests/demo-content-room/room.json
```
