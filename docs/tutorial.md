# Room with photos from scratch

## Local

1. Create a folder for the room and its native connection

NOTE: These are not automatically created as otherwise we couldn't know if creating the would happen on purpose. Adding this feature would need extending ConnectionClient interface with e.g. "createAddressForFolder" (+implementing it to each client) AND prompting "Are your sure to add new folder?" on each command using it.

```
mkdir ~/PhotoRoom/
mkdir ~/PhotoRoom/Diory\ Content
```

2. Create room to that folder

```
dcli room create --address ~/PhotoRoom
# OR
cd ~/PhotoRoom
dcli room create --here
```

3. Import single file to diograph

```
dcli import file /2022-07-20 19.32.33.png --copyContent
```

4. Create connection to some folders with photos

```
dcli connection create --address ~/MyPictures
```

5. Populate connection diograph to room.json from ~/MyPictures folder content

NOTE: You need ffmpeg dependency and FFMPEG_PATH if you have videos in the MyPictures folder (otherwise it can be omitted)

```
dcli config set FFMPEG_PATH /opt/homebrew/bin/ffmpeg
dcli connection list-contents
```

6. Copy diory from ~/MyPictures folder to room

NOTE: Diory id without "room-x:" prefix means connection in focus (as connections don't currently have ids to refer to)

```
dcli copy /Mary/PIXNIO-53799-6177x4118.jpeg room-1:/ --copyContent
```

7. Open room in diory-browser-electron

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
