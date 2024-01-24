*** Settings ***
Resource  keywords.robot
Library  Process
Library  OperatingSystem
Library  ./get_user_home.py
Library  ./run_dcli_command.py

Test Setup  Clean Up Files  /tmp

*** Test Cases ***
Test CLI Output --version
    ${output}=  Run Dcli Command  --version
    Should Be Equal  ${output.strip()}  0.1.0

Create Room
    Run Dcli Command  room create /tmp LocalClient
    ${config_file_path}=  Join With User Home  .dcli

    ${file_content}=  Get File  ${config_file_path}
    ${expected_output}=  Get File  ${SUITE_SOURCE}/../dcli_contents.txt
    Should Be Equal  ${file_content.strip()}  ${expected_output.strip()}

    ${file_content}=  Get File  /tmp/room.json
    ${expected_output}=  Get File  ${SUITE_SOURCE}/../room_json_contents.txt
    Should Be Equal  ${file_content.strip()}  ${expected_output.strip()}

    ${file_content}=  Get File  /tmp/diograph.json
    ${expected_output}=  Get File  ${SUITE_SOURCE}/../diograph_json_contents.txt
    Should Be Equal  ${file_content.strip()}  ${expected_output.strip()}

Create Connection
    Run Dcli Command  connection create

    ${config_file_path}=  Join With User Home  .dcli

    ${file_content}=  Get File  ${config_file_path}
    ${expected_output}=  Get File  ${SUITE_SOURCE}/../dcli_contents.txt
    Should Be Equal  ${file_content.strip()}  ${expected_output.strip()}

    ${file_content}=  Get File  /tmp/room.json
    ${expected_output}=  Get File  ${SUITE_SOURCE}/../room_json_contents.txt
    Should Be Equal  ${file_content.strip()}  ${expected_output.strip()}

    ${file_content}=  Get File  /tmp/diograph.json
    ${expected_output}=  Get File  ${SUITE_SOURCE}/../diograph_json_contents.txt
    Should Be Equal  ${file_content.strip()}  ${expected_output.strip()}
