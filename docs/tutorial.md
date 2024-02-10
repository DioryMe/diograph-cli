# Room with photos from scratch

## Local

1. Create a folder for the room and app data

```
mkdir ~/PhotoRoom
mkdir ~/PhotoRoom/room
mkdir ~/PhotoRoom/room/Diory\ Content
```

2. Create room to that folder

```
dcli room create ~/PhotoRoom/room
```

3. Create connection to some folders with photos

```
dcli connection create ~/PhotoRoom/MyPictures
```

4. List content in MyPictures folder and populate connection diograph to room.json

NOTE: You need ffmpeg dependency and FFMPEG_PATH if you have videos in the MyPictures folder (otherwise it can be omitted)

```
dcli config set FFMPEG_PATH=/opt/homebrew/bin/ffmpeg 
dcli connection listContents
```

5. Import chosen one diory into room (=native connection) with content

```
dcli import diory "/2022-07-20 19.32.33.png" --copyContent --targetConnection "/tmp"
```

6. Import single file to diograph

TODO: Doesn't add to diograph (diograph.addDiory didn't work...)

```
dcli import file ~/PhotoRoom/Munakokkeli.png --copyContent
```

7. Export file from diograph

```
dcli export file --contentId bafkreig6w4bromttln6hqnw3f3kqfhm7pcfbbtsgezaxvh7a2ipqbelrxy ./exported.png
```

8.  List room stuff

9. Filter room stuff by geo location

## S3

1. Choose / create a bucket for the room and app data + setup access to it

2. Create room to that bucket

```
aws-vault exec my-user -- dcli create room s3://my-test-bucket/PhotoRoom --clientType S3Client
```

3. Create connection to some folders with photos

```
dcli connection create s3://my-test-bucket/MyPictures --clientType S3Client
```

etc.
