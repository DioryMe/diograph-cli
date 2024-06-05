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

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  room create --address /tmp
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    Verify Config File Contents  ${CURDIR}/create_room_dcli_contents.txt
    Verify Room JSON Contents  ${CURDIR}/create_room_room_json.txt
    Verify Diograph JSON Contents  ${CURDIR}/create_room_diograph_json.txt

    # Creating already existing room should exit with code 1
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  room create --address /tmp
    Should Be Equal As Integers  ${exit_code}  1

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

Import Two Files (with and without content)
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  import file ${CURDIR}/demo-content-room/demo-content.png --copyContent
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  import file ${CURDIR}/demo-content-room/source/subsource/some-video.mp4
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

# Import Folder
#     ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  import folder ${CURDIR}/demo-content-room/source
#     Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

# Connection list-contents
#     ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  connection create ${CURDIR}/demo-content-room/source
#     Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

#     ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  connection list-contents
#     Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

Query Diograph By Text
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory query --all
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

Show Diory
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory show bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

Add Room
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  room add --address ${CURDIR}/demo-content-room
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

Test global flag default to be room in focus
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory query --all
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}
    Verify Output Contains  ${CURDIR}/demo_content_room_diory_list.txt  ${output}

# TODO: Implement the global flag
Test global flag to set connection in focus (create & query diory)
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory query --all --useConnectionInFocus
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    # TODO: Fix importAction & Connection list-contents
    # => authentic test case with demo-content-source-folder
    Verify Output Contains  ${CURDIR}/demo_content_source_connection_diory_list.txt  ${output}

# Copy diory from one room to another
#     ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  copy room-2:3e2ddc49-b3b6-4212-8a0a-80b9150a57ae room-1:/ --copyContent
#     Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}
