# Room with photos from scratch

## Local

1. Create a folder for the room and its native connection

NOTE: These are not automatically created as otherwise we couldn't know if creating the would happen on purpose. Adding this feature would need extending ConnectionClient interface with e.g. "createAddressForFolder" (+implementing it to each client) AND prompting "Are your sure to add new folder?" on each command using it.

```
mkdir ./PhotoRoom/
mkdir ./PhotoRoom/Diory\ Content
```

2. Create room to that folder

```
# NOTE: Only absolute paths here as this will be saved as room address
dcli room create --address $(pwd)/PhotoRoom
# OR
cd ./PhotoRoom
dcli room create --here
```

3. Import single file to diograph

```
dcli import file /2022-07-20 19.32.33.png
```

4. Import folder to diograph

```
dcli import folder --address $(pwd)/some-photos
```

4. Prepare and add demo-content-room

```
export DEMO_CONTENT_ROOM_PATH=/path/to/demo-content-room
# Set correct address for demo-content-room
sed -i '' 's|"/Diory Content",|"'$DEMO_CONTENT_ROOM_PATH'/Diory Content",|g' $DEMO_CONTENT_ROOM_PATH/room.json
# Add room
dcli room add --address $DEMO_CONTENT_ROOM_PATH
```

5. Copy diory from demo-content-room

```
dcli copy room-2:5c63b738-2bc0-449c-80a8-be04dfe1e8b4 room-1:/
```

6. Open room in diory-browser-electron

## Connecting to folder

1. Create connection to some folder with photos

```
dcli connection create --address ~/MyPictures
```

2. Populate connection diograph to room.json from ~/MyPictures folder content

NOTE: You need ffmpeg dependency and FFMPEG_PATH if you have videos in the MyPictures folder (otherwise it can be omitted)

```
dcli config set FFMPEG_PATH /opt/homebrew/bin/ffmpeg
dcli connection list-contents
```

3. Copy diory from ~/MyPictures folder to room

NOTE: Diory id without "room-x:" prefix means connection in focus (as connections don't currently have ids to refer to)

```
dcli copy bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona room-1:/
```

4. Open room in diory-browser-electron

## S3

1. Choose / create a bucket for the room and set credentials to it

```
dcli config set s3-credentials "[ACCESS_KEY] [SECRET_KEY]"
```

2. Create room to that bucket

```
dcli room create --address s3://my-test-bucket/PhotoRoom --clientType S3Client
```

3. Copy diory from ~/MyPictures folder to room

NOTE: Diory id without "room-x:" prefix means connection in focus (as connections don't currently have ids to refer to)

```
dcli copy /Mary/PIXNIO-53799-6177x4118.jpeg room-2:/ --copyContent
```

4. Copy diory from LocalClient room to S3Client room

```
dcli copy room-1:3e2ddc49-b3b6-4212-8a0a-80b9150a57ae room-2:/ --copyContent
```

5. Open room in diory-browser-electron

- NOT IMPLEMENTED YET
- requires S3Client for diory-browser-electron with credentials:

```
{
  clientConstructor: S3Client,
  credentials: { region: 'eu-west-1', [CREDENTIALS] },
}
```

## Exporting connection

NOTE: Only necessary to be able to show connection/list-contents stuff in diory-browser-electron. This method will be deprecated when concept of Connection is removed and everything will be just rooms.

Create room from list-contents:

```
dcli connection create --address ~/2023-tmp
dcli connection list-contents
mkdir /tmp/export3 && mkdir /tmp/export3/Diory\ Content
dcli connection export --address /tmp/export3
=> open browser and select room (+ wait for 2min...)
```
