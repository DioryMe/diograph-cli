Feature: Room

  Background:
    Given I have empty place for room
    And I initiate a room
    And room.json has 1 connection

  Scenario: Initiate room
    Then room.json does exists
    And room.json has 1 connections
    And diograph.json does exists
    # And diograph.json has one diory
    # And images folder exists
    # And images folder has no files

  Scenario: Delete room
    When I delete room
    Then room.json not exists
    And diograph.json not exists
    # And images folder not exists

  Scenario: Add connection to room
    When I add connection to content-source-folder
    Then room.json has 2 connections

  Scenario: Content source contents list
    When I add connection to content-source-folder
    And I call listClientContents operation
    Then last connection contentUrls has 5 diories
    # And images folder is not empty in application support room
    And room.json has 2 connections
    # And room.json connection has 123 contentUrls

  Scenario: Content source contents list 2
    When I add connection to content-source-folder
    And I call listClientContents2 operation
    Then last connection contentUrls has 2 diories
    # And images folder is not empty in application support room
    And room.json has 2 connections

  Scenario: Content source contents list for both
    When I add connection to content-source-folder
    And I call listClientContents operation
    And I call listClientContents2 operation
    Then last connection contentUrls has 7 diories
    # And images folder is not empty in application support room
    And room.json has 2 connections

  # Scenario: Add diory from content source
  #   When I add connection to content-source-folder
  #   And I call import operation for client
  #   Then diograph.json has two diories
  #   And images folder has one image

  Scenario: Import diory
    When I call importDiory
    Then diograph.json has 2 diories
    And images folder has 1 image
    And room.json has 1 connection
    And last connection has 0 contentUrls

  Scenario: Import diory with content
    When I call importDiory with content
    Then diograph.json has 2 diories
    And images folder has 1 image
    And content folder has 1 file
    And room.json has 1 connection
    And last connection has 1 contentUrls
    And last diory has dioryId as image
    And last diory has dioryId as contentUrl
    And last diory has image/jpeg as encodingFormat

  Scenario: Get content
    When I call importDiory with content
    Then I can call getPathFromContentUrl

  # Scenario: Delete diory with content
  #   When I call importDiory with content
  #   And I call deleteDiory with content for last diory
  #   Then diograph.json has 1 diories
  #   And images folder has 0 image
  #   And content folder has 0 file
  #   And last diory has some-diory-id as id
  #   And last diory has "Root diory" as text
