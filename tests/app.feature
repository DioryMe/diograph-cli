Feature: App

  Background:
    Given I have empty place for room

  Scenario:
    When I call dryRun operation

  Scenario: Set room in focus
    When I createRoom 'DEFAULT_TEST_ROOM'
    And I createRoom 'SECOND_TEST_ROOM'
    And I call setRoomInFocus operation with '0'
    Then app-data.json has 'DEFAULT_TEST_ROOM' as roomInFocus
    And app-data.json has 'DEFAULT_NATIVE_CONNECTION' as connectionInFocus

  Scenario: Set connection in focus
    When I createRoom 'DEFAULT_TEST_ROOM'
    And I createConnection 'CONTENT_SOURCE_CONNECTION'
    And I call setConnectionInFocus operation with '0'
    Then app-data.json has 'DEFAULT_NATIVE_CONNECTION' as connectionInFocus

  Scenario: Remove room
    When I createRoom 'DEFAULT_TEST_ROOM'
    And I call removeRoom operation
    Then app-data.json has no rooms
    And 'DEFAULT_TEST_ROOM' does exists
    And 'room.json' does exists
    And 'diograph.json' does exists

  Scenario: Delete room
    When I createRoom 'DEFAULT_TEST_ROOM'
    And I call deleteRoom operation
    Then app-data.json has no rooms
    And 'DEFAULT_TEST_ROOM' not exists
    And 'room.json' not exists
    And 'diograph.json' not exists
