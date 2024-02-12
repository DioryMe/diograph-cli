*** Settings ***
Resource  clean_up_files.robot
Resource  verify_file_contents.robot
Library  Process
Library  OperatingSystem
Library  ./get_config_file_path.py
Library  ./run_dcli_command.py

Suite Setup  Clean Up Files  /tmp

*** Test Cases ***
Test CLI Output --version
    ${exit_code}  ${output}=  Run Dcli Command  --version
    Should Be Equal As Integers  ${exit_code}  0
    Should Be Equal  ${output.strip()}  0.1.0

Create Room
    ${exit_code}  ${output}=  Run Dcli Command  room create
    Should Be Equal As Integers  ${exit_code}  0

    ${exit_code}  ${output}=  Run Dcli Command  room create --path /tmp
    Should Be Equal As Integers  ${exit_code}  0

    Verify Config File Contents  ${CURDIR}/create_room_dcli_contents.txt
    Verify Room JSON Contents  ${CURDIR}/create_room_room_json.txt
    Verify Diograph JSON Contents  ${CURDIR}/create_room_diograph_json.txt

    # Creating already existing room should exit with code 1
    ${exit_code}  ${output}=  Run Dcli Command  room create --path /tmp
    Should Be Equal As Integers  ${exit_code}  1

Add Room
    ${exit_code}  ${output}=  Run Dcli Command  room add
    Should Be Equal As Integers  ${exit_code}  0

Create Connection
    ${exit_code}  ${output}=  Run Dcli Command  connection create /tmp
    Should Be Equal As Integers  ${exit_code}  0

    Verify Config File Contents  ${CURDIR}/create_connection_dcli_contents.txt
    Verify Room JSON Contents  ${CURDIR}/create_connection_room_json.txt
    Verify Diograph JSON Contents  ${CURDIR}/create_connection_diograph_json.txt

Set Config Path
    # SKIP / TODO: Doesn't work on Github Actions until FFMPEG is installed and FFMPEG_PATH is set
    ${FFMPEG_PATH}=  Get Environment Variable  FFMPEG_PATH  /opt/homebrew/bin/ffmpeg
    ${exit_code}  ${output}=  Run Dcli Command  config set FFMPEG_PATH ${FFMPEG_PATH}
    Should Be Equal As Integers  ${exit_code}  0

Import Two Files
    ${exit_code}  ${output}=  Run Dcli Command  import file ${CURDIR}/demo-content-room/demo-content.png --copyContent
    Should Be Equal As Integers  ${exit_code}  0

    ${exit_code}  ${output}=  Run Dcli Command  import file ${CURDIR}/demo-content-room/source/subsource/some-video.mp4
    Should Be Equal As Integers  ${exit_code}  0

    # Fails in CI because of different FFMPEG_PATH
    # Verify Config File Contents  ${CURDIR}/import_file_dcli_contents.txt

    Verify Room JSON Contents  ${CURDIR}/import_file_room_json.txt
    Verify Diograph JSON Contents  ${CURDIR}/import_file_diograph_json.txt

Import Folder
    ${exit_code}  ${output}=  Run Dcli Command  import folder ${CURDIR}/demo-content-room/source
    Should Be Equal As Integers  ${exit_code}  0

    # Random UUID's and created & modified timestamps prevent using these:
    # Verify Room JSON Contents  ${CURDIR}/import_folder_room_json.txt
    # Verify Diograph JSON Contents  ${CURDIR}/import_folder_diograph_json.txt

Connection list-contents
    ${exit_code}  ${output}=  Run Dcli Command  connection create ${CURDIR}/demo-content-room/source
    Should Be Equal As Integers  ${exit_code}  0

    ${exit_code}  ${output}=  Run Dcli Command  connection list-contents
    Should Be Equal As Integers  ${exit_code}  0

    # Random UUID's and created & modified timestamps prevent using these:
    # Verify Room JSON Contents  ${CURDIR}/list_contents_room_json.txt
    # Verify Diograph JSON Contents  ${CURDIR}/list_contents_diograph_json.txt

Query Diograph By Text
    ${exit_code}  ${output}=  Run Dcli Command  diory query --all
    Should Be Equal As Integers  ${exit_code}  0

Show Diory
    ${exit_code}  ${output}=  Run Dcli Command  diory show bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona
    Should Be Equal As Integers  ${exit_code}  0
