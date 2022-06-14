Feature: Diograph

  Background:
    Given I have empty place for room
    And I initiate a room
    And diograph.json has 1 diories
    And room.json has 1 connection

  Scenario: Get diory
    When I call getDiory operation
    Then I receive a diory

  Scenario: Create diory
    When I call createDiory operation
    Then diograph.json has 2 diories

  # Scenario: Update diory
  #   When I call updateDiory for the last diory with "New name" as text
  #   Then last diory has "New name" as text

  # Scenario: Delete diory
  #   When I call deleteDiory for the last diory
  #   Then diograph.json has 0 diories
