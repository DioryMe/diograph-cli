*** Settings ***
Resource  keywords.robot
Library  Process
Library  OperatingSystem
Library  ./get_config_file_path.py
Library  ./run_dcli_command.py

Test Setup  Clean Up Files  /tmp

*** Test Cases ***
Test CLI Output --version
    ${exit_code}  ${output}=  Run Dcli Command  --version
    Log  ${output}
    Should Be Equal As Integers  ${exit_code}  0
    Should Be Equal  ${output.strip()}  0.1.0

Create Room
    ${exit_code}  ${output}=  Run Dcli Command  room create /tmp LocalClient
    Log  ${output}
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

Create Connection
    ${exit_code}  ${output}=  Run Dcli Command  connection create
    Log  ${output}
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