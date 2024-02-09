*** Settings ***
Library  OperatingSystem
Library  ./get_config_file_path.py

*** Keywords ***
Clean Up Files
    [Arguments]  ${roomAddress}
    Delete Config File
    Initiate Config File
    Delete Room  ${roomAddress}
    Initiate Room  ${roomAddress}
Initiate Room
    [Arguments]  ${roomAddress}
    OperatingSystem.Run  touch ~/.dcli && mkdir /tmp/Diory\\ Content
Delete Room
    [Arguments]  ${roomAddress}
    Should Not Be Empty  ${roomAddress}
    Should Not Contain  ${roomAddress}  *
    Should Not Contain  ${roomAddress}  .
    OperatingSystem.Run  rm ${roomAddress}/room.json
    OperatingSystem.Run  rm ${roomAddress}/diograph.json
    OperatingSystem.Run  rm -rf ${roomAddress}/Diory\ Content
Reset Room
    [Arguments]  ${roomAddress}
    Delete Room  ${roomAddress}
    Initiate Room  ${roomAddress}

Reset Config File
    Delete Config File
    Initiate Config File

Initiate Config File
    ${config_file_path}=  Get Config File Path
    OperatingSystem.Run  touch ${config_file_path}

Delete Config File
    ${config_file_path}=  Get Config File Path
    OperatingSystem.Run  rm ${config_file_path}
