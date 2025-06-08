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

*** Test Cases ***
Add Room
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  config set http-credentials e10d1d2e-032e-4c42-bc53-587239a3119f
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    # TODO: Host demo-content-room for HTTPClient with basic auth online
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  room add --address http://diory-demo-content.surge.sh --clientType HttpClient
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

Query Diograph By Text
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory query --all
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}
    Verify Output Contains  ${CURDIR}/demo_content_room_diory_list.txt  ${output}

Copy diory from one room to another
    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  room create --address /tmp
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  diory create "Created Diory" new-diory-id
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}
    Verify Diory Attribute  new-diory-id  text  Created Diory

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  copy room-1:3e2ddc49-b3b6-4212-8a0a-80b9150a57ae room-2:/
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    ${exit_code}  ${output}  ${error_output}=  Run Dcli Command  room focus room-1
    Verify Exit Code Zero  ${exit_code}  ${output}  ${error_output}

    Verify Diory Attribute  3e2ddc49-b3b6-4212-8a0a-80b9150a57ae  id  3e2ddc49-b3b6-4212-8a0a-80b9150a57ae
    Verify Diory Links  /  3e2ddc49-b3b6-4212-8a0a-80b9150a57ae
    # Links should be removed from the copied diory
    Verify Not Diory Links  3e2ddc49-b3b6-4212-8a0a-80b9150a57ae  6abcc50e-422e-4802-9b14-84fcdd08f591
