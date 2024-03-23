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
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  --version
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}
    Should Be Equal  ${output.strip()}  0.1.1

Create Room
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  room create
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  room create --path /tmp
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    Verify Config File Contents  ${CURDIR}/create_room_dcli_contents.txt
    Verify Room JSON Contents  ${CURDIR}/create_room_room_json.txt
    Verify Diograph JSON Contents  ${CURDIR}/create_room_diograph_json.txt

    # Creating already existing room should exit with code 1
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  room create --path /tmp
    Should Be Equal As Integers  ${exit_code}  1

Add Room
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  room add
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

Create Connection
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  connection create /tmp
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    Verify Config File Contents  ${CURDIR}/create_connection_dcli_contents.txt
    Verify Room JSON Contents  ${CURDIR}/create_connection_room_json.txt
    Verify Diograph JSON Contents  ${CURDIR}/create_connection_diograph_json.txt

Set Config Path
    ${FFMPEG_PATH}=  Get Environment Variable  FFMPEG_PATH  /opt/homebrew/bin/ffmpeg
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  config set FFMPEG_PATH ${FFMPEG_PATH}
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    Config File Contains  ffmpegPath

Import Two Files
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  import file ${CURDIR}/demo-content-room/demo-content.png --copyContent
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  import file ${CURDIR}/demo-content-room/source/subsource/some-video.mp4
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    # Fails in CI because of different FFMPEG_PATH
    # Verify Config File Contents  ${CURDIR}/import_file_dcli_contents.txt

    # Random UUID's and created & modified timestamps prevent using these:
    # Verify Room JSON Contents  ${CURDIR}/import_file_room_json.txt
    # Verify Diograph JSON Contents  ${CURDIR}/import_file_diograph_json.txt

Import Folder
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  import folder ${CURDIR}/demo-content-room/source
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    # Random UUID's and created & modified timestamps prevent using these:
    # Verify Room JSON Contents  ${CURDIR}/import_folder_room_json.txt
    # Verify Diograph JSON Contents  ${CURDIR}/import_folder_diograph_json.txt

Connection list-contents
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  connection create ${CURDIR}/demo-content-room/source
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  connection list-contents
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    # Random UUID's and created & modified timestamps prevent using these:
    # Verify Room JSON Contents  ${CURDIR}/list_contents_room_json.txt
    # Verify Diograph JSON Contents  ${CURDIR}/list_contents_diograph_json.txt

Query Diograph By Text
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory query --all
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

Show Diory
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory show bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}
