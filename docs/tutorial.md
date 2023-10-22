# Room with photos from scratch

## Local

1. Create a folder for the room and app data

```
mkdir ~/PhotoRoom
mkdir ~/PhotoRoom/room
mkdir ~/PhotoRoom/room/Diory\ Content
mkdir ~/PhotoRoom/app-data
```

2. Create room to that folder

```
APP_DATA_FOLDER=~/PhotoRoom/app-data node ./testApp/test-cli.js createRoom ~/PhotoRoom/room
```

3. Create connection to some folders with photos

```
APP_DATA_FOLDER=~/PhotoRoom/app-data node ./testApp/test-cli.js createConnection ~/PhotoRoom/MyPictures
```

4. List content in MyPictures folder and populate connection diograph to room.json

NOTE: You need ffmpeg dependency and FFMPEG_PATH if you have videos in the MyPictures folder (otherwise it can be omitted)

```
FFMPEG_PATH=/opt/homebrew/bin/ffmpeg APP_DATA_FOLDER=~/PhotoRoom/app-data node ./testApp/test-cli.js listConnectionContents
```

6. Import all (TODO: select chosen ones) into room (=native connection)

```
APP_DATA_FOLDER=~/PhotoRoom/app-data node ./testApp/test-cli.js import "/2022-07-20 19.32.33.png" true
```

7. Import single file to diograph

TODO: Doesn't add to diograph (diograph.addDiory didn't work...)

```
APP_DATA_FOLDER=~/PhotoRoom/app-data node ./testApp/test-cli.js importDioryFromFile ~/PhotoRoom/Munakokkeli.png true
```

8. Export file from diograph

```
APP_DATA_FOLDER=~/PhotoRoom/app-data node ./testApp/test-cli.js writeFileFromContent bafkreig6w4bromttln6hqnw3f3kqfhm7pcfbbtsgezaxvh7a2ipqbelrxy ./exported.png
```

9.  List room stuff

10. Filter room stuff by geo location

## S3

1. Choose / create a bucket for the room and app data + setup access to it

2. Create room to that bucket

```
aws-vault exec my-user -- APP_DATA_FOLDER=/tmp node ./testApp/test-cli.js createRoom s3://my-test-bucket/PhotoRoom S3Client
```

3. Create connection to some folders with photos

```
APP_DATA_FOLDER=~/tmp node ./testApp/test-cli.js createConnection s3://my-test-bucket/MyPictures S3Client
```

4.
