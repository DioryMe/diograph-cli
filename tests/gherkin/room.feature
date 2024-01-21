Feature: Room

  Background:
    Given I have empty place for room
    And I createRoom 'DEFAULT_TEST_ROOM'

  Scenario: Create room
    Then 'room.json' does exists
    And room.json has 1 connections
    And 'diograph.json' does exists
    And diograph.json has 0 diories
    And app-data.json has 'DEFAULT_TEST_ROOM' as roomInFocus
    And app-data.json has 'DEFAULT_NATIVE_CONNECTION' as connectionInFocus

  Scenario: Create another room
    When I createRoom 'SECOND_TEST_ROOM'
    And app-data.json has 'SECOND_TEST_ROOM' as roomInFocus
    And app-data.json has 'SECOND_NATIVE_CONNECTION' as connectionInFocus

  Scenario: Create connection to room
    When I createConnection 'CONTENT_SOURCE_CONNECTION'
    Then room.json has 2 connections
    And app-data.json has 'CONTENT_SOURCE_CONNECTION' as connectionInFocus

  Scenario: Delete room
    When I call deleteRoom operation
    Then 'room.json' not exists
    And 'diograph.json' not exists
    And 'CONTENT_SOURCE_CONNECTION' not exists

###

  Scenario: Remove connection
    Given room.json has 1 connection
    When I call removeConnection operation
    Then room.json has no connections
    And 'DEFAULT_NATIVE_CONNECTION' does exist

  Scenario: Delete connection
    Given room.json has 1 connection
    When I call deleteConnection operation
    Then room.json has no connections
    And 'DEFAULT_NATIVE_CONNECTION' not exists

###

  Scenario: Content source contents list
    When I createConnection 'CONTENT_SOURCE_CONNECTION'
    And I call listConnectionContents operation with '/'
    Then last connection diograph has 3 diories
    And last connection has 1 contentUrls

  Scenario: Content source contents list 2
    When I createConnection 'CONTENT_SOURCE_CONNECTION'
    And I call listConnectionContents operation with '/Subfolder'
    Then last connection diograph has 3 diories
    And last connection has 3 contentUrls

  Scenario: Content source contents list for both
    When I createConnection 'CONTENT_SOURCE_CONNECTION'
    And I call listConnectionContents operation with '/'
    And I call listConnectionContents operation with '/Subfolder'
    Then last connection diograph has 6 diories
    And last connection has 4 contentUrls

  Scenario: Add diory to content source
    When I createConnection 'CONTENT_SOURCE_CONNECTION'
    And I call listConnectionContents operation with '/'
    And I import last diory to first connection
    Then diograph.json has 1 diories
    And content folder has 0 file

###

  # TODO: Demo content room doesn't have absolute paths and THAT IS A PROBLEM!!!
  # Error: ENOENT: no such file or directory, open '.../demo-content-room/source.../demo-content-room/source/one-test-image.jpg'
  # Scenario: Add diory from content source with content
  #   When I add connection to content-source-folder
  #   And I call listConnectionContents operation
  #   And I import last diory to first connection with content
  #   Then diograph.json has 1 diories
  #   And content folder has 1 file

###

  Scenario: Import diory
    When I call importDioryFromFile
    Then diograph.json has 1 diories
    And room.json has 1 connection
    And last connection has 0 contentUrls

  Scenario: Import diory with content
    When I call importDioryFromFile with content
    Then diograph.json has 1 diories
    And content folder has 1 file
    And last connection has 1 contentUrls
    And last diory has image/png as encodingFormat
    And last diory has bafkreihoednm4s2g4vpame3mweewfq5of3hks2mbmkvoksxg3z4rhmweeu as contentUrl
    And last connection diograph has 1 diories

###

  # Scenario: Delete diory with content
  #   When I call importDioryFromFile with content
  #   And I call deleteDiory with content for last diory
  #   Then diograph.json has 1 diories
  #   And images folder has 0 image
  #   And content folder has 0 file
  #   And last diory has some-diory-id as id
  #   And last diory has "Root diory" as text
