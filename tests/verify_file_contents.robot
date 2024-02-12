*** Settings ***
Library  OperatingSystem
Library  ./get_config_file_path.py

*** Variables ***
${room_json_file_path}  /tmp/room.json
${diograph_json_file_path}  /tmp/diograph.json

*** Keywords ***
Verify Config File Contents
    [Arguments]    ${expected_file_path}
    ${config_file_path}=    Get Config File Path
    Compare File Contents    ${expected_file_path}     ${config_file_path}

Verify Room JSON Contents
    [Arguments]    ${expected_file_path}
    Compare File Contents    ${expected_file_path}     ${room_json_file_path}

Verify Diograph JSON Contents
    [Arguments]    ${expected_file_path}
    Compare File Contents    ${expected_file_path}    ${diograph_json_file_path}

Compare File Contents
    [Arguments]    ${expected_file_path}  ${resource_file_path}
    ${file_content}=    Get File    ${resource_file_path}
    ${expected_output}=    Get File    ${expected_file_path}
    Should Be Equal    ${file_content.strip()}    ${expected_output.strip()}
