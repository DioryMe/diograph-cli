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
- show room in focus and connection in focus

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
- NOTE: Only absolute paths here as this will be saved as room address
- create new room to given address
  - create to current diory using `--here` instead of `--address`
  - TODO: Prompt user to create address if it doesn't exist
- use LocalClient unless `--clientType S3Client` used
- create native connection to it in <address>/Diory\ Content
- set room in focus
- set its connection in focus
- save room info to config file

room add --address <address>
- NOTE: Only absolute paths here as this will be saved as room address
- add existing room into app and set it in focus
  - add room in current diory using `--here` instead of `--address`
- use LocalClient unless `--clientType S3Client` used
- set room in focus
- save room info to config file

room remove --roomId <room-id> (or --address <address>)
- remove room info from config file
- confirm question (can be skipped with --yes)
- doesn't delete any files or folders
- room can be re-added with `room add`

room destroy --roomId <room-id> (or --address <address>)
- ONLY PARTLY IMPLEMENTED!
- `--dryrun` mode only implemented as currently seen still as too dangerous to use freely...
- same as room remove but also deletes files and folders
- confirm question (can be skipped with --yes)
- deletes also native connections' files and folders
  - can be skipped with `--preserveNativeConnection` (or `--destroyNativeConnection`?)

connection create --address <address>
- connect given folder
- save connection info to the room in focus
- use LocalClient unless `--clientType S3Client` used
- set connection in focus

connection list-contents <connectionAddress>
- generate diograph for the connection from folder contents

connection export --address <address>
- export connection in focus as room to given address
- NOTE: only necessary to be able to show it in diory-browser-electron

connection focus <connectionAddress>
- NOT IMPLEMENTED YET!
- set given connection in focus
  - NOTE: Focus needs the whole Connection object (no id or address)

connection remove <connectionAddress>
- NOT IMPLEMENTED YET!
- delete all the information about the connection
- connection doesn't have destroy as it is either
  - part of the room (=diory contents) or
  - something we shouldn't touch (=user's personal photos)

diory query --all
- show all diories in room in focus
  - with `--useConnectionInFocus` from connection in focus

diory query text <search text>
- list all diories which have search text in their text field

diory query --latlngStart "61.34890819479005, 24.252450413456693" --latlngEnd "61.34513645163953, 24.264384935041175"
diory query --dateStart 2021-01-01T00:00:00Z --dateEnd 2022-01-01T00:00:00Z
diory query --date 2021-01-01
- list all diories from given geo area, time period or date
- with `--allRooms` search from each LocalClient room there is in .dcli

import folder --address <folderPath>
- generate diograph from given folder structure
- add diograph to room in focus
- copy content to native connection
  - with `--diographOnly` doesn't copy content, adds only diograph

import file <filePath>
- generate diory from given file contents
- link it to the root diory of the room in focus
  - TODO: Link to any diory in the room in focus with --fromDioryId argument
- add content to room in focus native connection
  - with `--diographOnly` doesn't copy content, adds only diograph

copy <fromDioryRoom>:<fromDioryId> <toDioryRoom>:<toDioryId>
- copy diory from one room or connection to another room
- link the newly created diory to toDiory
- copy fromDiory content to destination room's native connection
  - with `--diographOnly` doesn't copy content, adds only diograph

export content <CID> <destinationPath>
- NOT IMPLEMENTED YET!
- read buffer of the content from connection wherever it is available for the app
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
diory update (not implemented)
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
