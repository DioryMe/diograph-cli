*** Settings ***
# Resource  clean_up_files.robot
Resource  verify_file_contents.robot
Library  Process
Library  OperatingSystem
Library  ./get_config_file_path.py
Library  ./run_dcli_command.py

Suite Setup  Initiate necessary files and folders

*** Keywords ***
Initiate necessary files and folders
    ${config_file_path}=  Get Config File Path
    OperatingSystem.Run  mkdir -p /tmp/Diory\\ Content
    OperatingSystem.Run  mkdir -p /tmp/exported-room
    OperatingSystem.Run  mkdir -p /tmp/exported-room/Diory\\ Content

*** Test Cases ***
Test CLI Output --help
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  --help
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

Test CLI status command
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  status
    Should Be Equal  ${output.strip()}  No roomInFocus defined in config file

Create Room
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  room create
    Should Be Equal  ${output.strip()}  Please provide a room --address or --here

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  room create --address /tmp
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    Verify Config File Contents  ${CURDIR}/create_room_dcli_contents.txt
    Verify Room JSON Contents  ${CURDIR}/create_room_room_json.txt
    Verify Diograph JSON Contents  ${CURDIR}/create_room_diograph_json.txt

    # Creating already existing room should exit with code 1
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  room create --address /tmp
    Should Be Equal As Integers  ${exit_code}  1

Create Connection
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  connection create --address /tmp
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    Verify Config File Contents  ${CURDIR}/create_connection_dcli_contents.txt
    Verify Room JSON Contents  ${CURDIR}/create_connection_room_json.txt
    Verify Diograph JSON Contents  ${CURDIR}/create_connection_diograph_json.txt

Set Config Path
    ${FFMPEG_PATH}=  Get Environment Variable  FFMPEG_PATH  /opt/homebrew/bin/ffmpeg
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  config set FFMPEG_PATH ${FFMPEG_PATH}
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    Config File Contains  ffmpegPath

Import Two Files (with and without content)
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  import file ${CURDIR}/demo-content-room/demo-content.png --copyContent
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    Verify Diory Data Attribute  bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona  contentUrl  bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona
    Verify Diory Data Attribute  bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona  encodingFormat  image/png
    Verify Diory Links  /  bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona
    File Should Exist    /tmp/Diory\ Content/bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona

    # TODO: Does the new content also exist on room.json CIDMapping?

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  import file ${CURDIR}/demo-content-room/source/subsource/some-video.mp4
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    Verify Diory Data Attribute  bafkreia2c44rszqme57sao4ydipv3xtwfoigag7b2lzfeuwtunctzfdx4a  encodingFormat  video/x-m4v
    # FIXME: Gives 00:00:16.94 in Github Actions
    # Verify Diory Data Attribute  bafkreia2c44rszqme57sao4ydipv3xtwfoigag7b2lzfeuwtunctzfdx4a  duration  00:00:16.93
    Verify Diory Links  /  bafkreia2c44rszqme57sao4ydipv3xtwfoigag7b2lzfeuwtunctzfdx4a

# FIXME: "queryDiograph() is disabled because it doesn't work with validated diographs"
# Query Diograph By Text
#     ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory query --all
#     Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

Show Create Link Unlink Delete Diory
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory show bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory create "Created Diory" new-diory-id
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}
    Verify Diory Attribute  new-diory-id  text  Created Diory

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory link bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona new-diory-id
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}
    Verify Diory Links  bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona  new-diory-id

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory unlink bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona new-diory-id
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}
    Verify Not Diory Links  bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona  new-diory-id

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory remove new-diory-id
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}
    Verify Diory Not Exists  new-diory-id

    # FIXME: This would fail if unlink wouldn't happen as currently @diograph/diograph doesn't remove links to it when diory is removed
    Verify Not Diory Links  bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona  new-diory-id

Add Room
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  room add --address ${CURDIR}/demo-content-room
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

Test global flag default to be room in focus
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory query --all
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}
    Verify Output Contains  ${CURDIR}/demo_content_room_diory_list.txt  ${output}

Test global flag to set connection in focus (create & query diory)
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory query --all --useConnectionInFocus
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    # TODO: Fix importAction & Connection list-contents
    # => authentic test case with demo-content-source-folder
    Verify Output Contains  ${CURDIR}/demo_content_source_connection_diory_list.txt  ${output}

Copy diory from connection to room and link it to the given diory with content
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  copy /Mary/PIXNIO-53799-6177x4118.jpeg room-1:/ --copyContent
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    Verify Diory Attribute  /Mary/PIXNIO-53799-6177x4118.jpeg  id  /Mary/PIXNIO-53799-6177x4118.jpeg
    Verify Diory Data Attribute  /Mary/PIXNIO-53799-6177x4118.jpeg  @type  ImageObject
    Verify Diory Links  /  /Mary/PIXNIO-53799-6177x4118.jpeg
    File Should Exist    /tmp/Diory\ Content/bafkreihp3h6ggnxysuobjsgtsibaqq5khzjbaamyy6ec2adredtf2ixz3u

    # TODO: Does the new content also exist on room.json CIDMapping?

Copy diory from one room to another
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  copy room-2:3e2ddc49-b3b6-4212-8a0a-80b9150a57ae room-1:/
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    Verify Diory Attribute  3e2ddc49-b3b6-4212-8a0a-80b9150a57ae  id  3e2ddc49-b3b6-4212-8a0a-80b9150a57ae
    Verify Diory Links  /  3e2ddc49-b3b6-4212-8a0a-80b9150a57ae
    # Links should be removed from the copied diory
    Verify Not Diory Links  3e2ddc49-b3b6-4212-8a0a-80b9150a57ae  6abcc50e-422e-4802-9b14-84fcdd08f591

Import Folder
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  import folder ${CURDIR}/demo-content-room/source
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

Connection list-contents
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  connection create --address ${CURDIR}/demo-content-room/source
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  connection list-contents
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

Test CLI list rooms command
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  list rooms
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

Test CLI list connections command
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  list connections
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

Export Connection As Room
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  connection export --address /tmp/exported-room
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    File Should Exist    /tmp/exported-room/room.json
    File Should Exist    /tmp/exported-room/diograph.json


Query Diograph By Text


    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory query --all
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory query --text some-video
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}
    # Yksi rivi vain

Query Diograph By Date
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory query --date 2021-04-07T00:00:00Z
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}
    Should Contain    ${output}    Date geo searchResult [ 'bafkreia2c44rszqme57sao4ydipv3xtwfoigag7b2lzfeuwtunctzfdx4a' ]

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory query --dateStart 2021-01-01T00:00:00Z --dateEnd 2022-01-01T00:00:00Z
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}
    Should Contain    ${output}   Date geo searchResult [ 'bafkreia2c44rszqme57sao4ydipv3xtwfoigag7b2lzfeuwtunctzfdx4a' ]

Query Diograph By LatLng
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory query --latlngStart 43.464500N,11.88147800E --latlngEnd 43.464400N,11.88147900E
    Should Contain    ${output}    bafkreihoednm4s2g4vpame3mweewfq5of3hks2mbmkvoksxg3z4rhmweeu
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory query --latlngStart 43.464600N,11.88147800E --latlngEnd 43.464500N,11.88147900E
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    Should Not Contain    ${output}    'bafkreihoednm4s2g4vpame3mweewfq5of3hks2mbmkvoksxg3z4rhmweeu'
