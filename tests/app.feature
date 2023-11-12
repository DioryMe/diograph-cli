Feature: App

  Background:
    Given I have empty place for room
    And I createRoom 'DEFAULT_TEST_ROOM'
    And app-data.json has 1 room

  Scenario: Call dryRun, status, listRooms, listAppRooms, getDiograph, listAppConnections, listConnections, getConnectionDiograph
    When I call dryRun operation
    When I call status operation
    And I call listRooms operation
    And I call listAppRooms operation
    And I call getDiograph operation
    And I call listAppConnections operation
    And I call listConnections operation
    And I call getConnectionDiograph operation

###

  Scenario: Set room in focus
    And I createRoom 'SECOND_TEST_ROOM'
    And I call setRoomInFocus operation with '0'
    Then app-data.json has 'DEFAULT_TEST_ROOM' as roomInFocus
    And app-data.json has 'DEFAULT_NATIVE_CONNECTION' as connectionInFocus

  Scenario: Set connection in focus
    And I createConnection 'CONTENT_SOURCE_CONNECTION'
    And I call setConnectionInFocus operation with '0'
    Then app-data.json has 'DEFAULT_NATIVE_CONNECTION' as connectionInFocus

  ###

  Scenario: Remove room
    And I call removeRoom operation
    Then app-data.json has no rooms
    And app-data.json has 'null' as roomInFocus
    And app-data.json has 'null' as connectionInFocus
    And 'DEFAULT_TEST_ROOM' does exists
    And 'room.json' does exists
    And 'diograph.json' does exists

  Scenario: Delete room
    And I call deleteRoom operation
    Then app-data.json has no rooms
    And app-data.json has 'null' as roomInFocus
    And app-data.json has 'null' as connectionInFocus
    And 'DEFAULT_TEST_ROOM' not exists
    And 'room.json' not exists
    And 'diograph.json' not exists

  ###

  Scenario: Remove connection
    When I call removeConnection operation
    And app-data.json has 'null' as connectionInFocus

  Scenario: Delete connection
    When I call deleteConnection operation
    And app-data.json has 'null' as connectionInFocus
