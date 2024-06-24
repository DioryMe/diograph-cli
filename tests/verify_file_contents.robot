*** Settings ***
Library  OperatingSystem
Library  ./get_config_file_path.py

*** Variables ***
${room_json_file_path}  /tmp/room.json
${diograph_json_file_path}  /tmp/diograph.json

*** Keywords ***

Verify Output Contains
    [Arguments]    ${resource_file_path}  ${expected_output}
    ${file_content}=    Get File    ${resource_file_path}
    Should Be Equal    ${file_content.strip()}    ${expected_output.strip()}

Verify Config File Contents
    [Arguments]    ${expected_file_path}
    ${config_file_path}=    Get Config File Path
    Compare File Contents    ${expected_file_path}     ${config_file_path}

Config File Contains
    [Arguments]    ${expected_content}
    ${config_file_path}=   Get Config File Path
    ${file_contents}=  Get File    ${config_file_path}
    Should Contain    ${file_contents}    ${expected_content}

Verify Exit Code Zero
    [Arguments]    ${exit_code}  ${output}  ${error_output}
    Run Keyword If  ${exit_code} != 0  Fail  Exit code is not 0. Error: '${error_output}' Output: '${output}'

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

Should Be In Links Array
    [Arguments]  ${linksArray}  ${match}
    ${found}=  Set Variable  ${False}
    FOR  ${item}  IN  @{linksArray}
        ${found}=  Set Variable If  '${item}[id]' == '${match}'  ${True}  ${found}
    END
    Should Be True  ${found}

Should Not Be In Links Array
    [Arguments]  ${linksArray}  ${match}
    ${found}=  Set Variable  ${False}
    # Should Not Be True  '${dioryId}' in ${diographObject}
    FOR  ${item}  IN  @{linksArray}
        ${found}=  Set Variable If  '${item}[id]' == '${match}'  ${True}  ${found}
    END
    Should Not Be True  ${found}

Verify Diory Links
    [Arguments]  ${dioryId}  ${linkToDioryId}
    ${content}=  Get File  ${diograph_json_file_path}
    ${diographObject}=  Evaluate  json.loads('''${content}''')  json
    Should Be In Links Array  ${diographObject}[${dioryId}][links]  ${linkToDioryId}

Verify Not Diory Links
    [Arguments]  ${dioryId}  ${linkToDioryId}
    ${content}=  Get File  ${diograph_json_file_path}
    ${diographObject}=  Evaluate  json.loads('''${content}''')  json
    Run Keyword If  'links' in ${diographObject}[${dioryId}]
        ...  Should Not Be In Links Array  ${diographObject}[${dioryId}][links]  ${linkToDioryId}

Verify Diory Attribute
    [Arguments]  ${dioryId}  ${attributeName}  ${value}
    ${content}=  Get File  ${diograph_json_file_path}
    ${diographObject}=  Evaluate  json.loads('''${content}''')  json
    # Should Be True  '${diographObject}[${key}][${subkey}]' == '${value}'  msg=Diory '${key}' doesn't have attribute '${subkey}' with the value '${value}' (actual: ${diographObject}[${key}][${subkey}])
    Should Be Equal  ${diographObject}[${dioryId}][${attributeName}]  ${value}

Verify Diory Data Attribute
    [Arguments]  ${dioryId}  ${dataAttributeName}  ${value}
    ${content}=  Get File  ${diograph_json_file_path}
    ${diographObject}=  Evaluate  json.loads('''${content}''')  json
    Should Be Equal  ${diographObject}[${dioryId}][data][0][${dataAttributeName}]  ${value}

Verify Diory Not Exists
    [Arguments]  ${dioryId}
    ${content}=  Get File  ${diograph_json_file_path}
    ${diographObject}=  Evaluate  json.loads('''${content}''')  json
    Should Not Be True  '${dioryId}' in ${diographObject}
