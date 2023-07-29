Feature: Room

  Background:
    Given I have empty place for room

  Scenario:
    When I call dryRun operation

  # TODO:
  Scenario: Set room in focus
    When I call createRoom operation with DEFAULT_TEST_ROOM
    And I call createRoom operation with SECOND_TEST_ROOM
    And I call setRoomInFocus operation with '0'
    # Then app-data.json has DEFAULT_TEST_ROOM as roomInFocus

  # TODO:
  # Scenario: Set connection in focus
  #   When I call createRoom operation with DEFAULT_TEST_ROOM
  #   And I call addConnection operation with WTFWTF
  #   And I call addConnection operation with WTFWTF2
  #   And I call setConnectionInFocus with 0
  #   Then app-data.json has WTFWTF as connectionInFocus
