*** Settings ***
Resource  keywords.robot
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

    ${config_file_path}=  Get Config File Path

    ${file_content}=  Get File  ${config_file_path}
    ${expected_output}=  Get File  ${SUITE_SOURCE}/../dcli_contents.txt
    Should Be Equal  ${file_content.strip()}  ${expected_output.strip()}

    ${file_content}=  Get File  /tmp/room.json
    ${expected_output}=  Get File  ${SUITE_SOURCE}/../room_json_contents.txt
    Should Be Equal  ${file_content.strip()}  ${expected_output.strip()}

    ${file_content}=  Get File  /tmp/diograph.json
    ${expected_output}=  Get File  ${SUITE_SOURCE}/../diograph_json_contents.txt
    Should Be Equal  ${file_content.strip()}  ${expected_output.strip()}

    # Creating already existing room should exit with code 1
    ${exit_code}  ${output}=  Run Dcli Command  room create --path /tmp
    Should Be Equal As Integers  ${exit_code}  1

Add Room
    ${exit_code}  ${output}=  Run Dcli Command  room add
    Should Be Equal As Integers  ${exit_code}  0

Create Connection
    ${exit_code}  ${output}=  Run Dcli Command  connection create /tmp
    Should Be Equal As Integers  ${exit_code}  0

    ${config_file_path}=  Get Config File Path

    ${file_content}=  Get File  ${config_file_path}
    ${expected_output}=  Get File  ${SUITE_SOURCE}/../dcli_contents2.txt
    Should Be Equal  ${file_content.strip()}  ${expected_output.strip()}

    ${file_content}=  Get File  /tmp/room.json
    ${expected_output}=  Get File  ${SUITE_SOURCE}/../room_json_contents2.txt
    Should Be Equal  ${file_content.strip()}  ${expected_output.strip()}

    ${file_content}=  Get File  /tmp/diograph.json
    ${expected_output}=  Get File  ${SUITE_SOURCE}/../diograph_json_contents.txt
    Should Be Equal  ${file_content.strip()}  ${expected_output.strip()}

Set Config Path
    # SKIP / TODO: Doesn't work on Github Actions until FFMPEG is installed and FFMPEG_PATH is set
    ${FFMPEG_PATH}=  Get Environment Variable  FFMPEG_PATH  /opt/homebrew/bin/ffmpeg
    ${exit_code}  ${output}=  Run Dcli Command  config set FFMPEG_PATH ${FFMPEG_PATH}
    Should Be Equal As Integers  ${exit_code}  0

Import Two Files
    ${exit_code}  ${output}=  Run Dcli Command  import file ${SUITE_SOURCE}/../demo-content-room/demo-content.png
    Should Be Equal As Integers  ${exit_code}  0

    ${exit_code}  ${output}=  Run Dcli Command  import file ${SUITE_SOURCE}/../demo-content-room/source/subsource/some-video.mp4
    Should Be Equal As Integers  ${exit_code}  0

Import Folder
    ${exit_code}  ${output}=  Run Dcli Command  import folder ${SUITE_SOURCE}/../demo-content-room/source
    Should Be Equal As Integers  ${exit_code}  0

Query Diograph
    ${exit_code}  ${output}=  Run Dcli Command  diory query --all
    Should Be Equal As Integers  ${exit_code}  0

Show Diory
    ${exit_code}  ${output}=  Run Dcli Command  diory show bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona
    Should Be Equal As Integers  ${exit_code}  0
