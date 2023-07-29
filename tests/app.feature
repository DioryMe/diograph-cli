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
    # And I call addConnection operation with 'CONTENT_SOURCE_CONNECTION'
    # Remove this:
    And I add connection to content-source-folder
    And I call setConnectionInFocus operation with '0'
    Then app-data.json has 'DEFAULT_NATIVE_CONNECTION' as connectionInFocus
