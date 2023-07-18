Feature: Room

  Background:
    Given I have empty place for room
    And I initiate a room

  Scenario: Initiate room
    Then room.json does exists
    And room.json has 1 connections
    And diograph.json does exists
    And diograph.json has 0 diories

  # "Delete room" does nothing if no Room in focus
  # Scenario: Delete room
  #   When I delete room
  #   Then room.json not exists
  #   And diograph.json not exists

  Scenario: Add connection to room
    When I add connection to content-source-folder
    Then room.json has 2 connections

  Scenario: Content source contents list
    When I add connection to content-source-folder
    And I call listClientContents operation
    Then last connection diograph has 3 diories
    And last connection has 1 contentUrls

  Scenario: Content source contents list 2
    When I add connection to content-source-folder
    And I call listClientContents2 operation
    Then last connection diograph has 3 diories
    And last connection has 3 contentUrls

  Scenario: Content source contents list for both
    When I add connection to content-source-folder
    And I call listClientContents operation
    And I call listClientContents2 operation
    Then last connection diograph has 6 diories
    And last connection has 4 contentUrls

  Scenario: Add diory from content source
    When I add connection to content-source-folder
    And I call listClientContents operation
    And I import last diory to first connection
    Then diograph.json has 1 diories
    And content folder has 0 file
    And I get url from getContent with 'bafkreihoednm4s2g4vpame3mweewfq5of3hks2mbmkvoksxg3z4rhmweeu'

  # TODO: Demo content room doesn't have absolute paths and THAT IS A PROBLEM!!!
  # Error: ENOENT: no such file or directory, open '.../demo-content-room/source.../demo-content-room/source/one-test-image.jpg'
  # Scenario: Add diory from content source with content
  #   When I add connection to content-source-folder
  #   And I call listClientContents operation
  #   And I import last diory to first connection with content
  #   Then diograph.json has 1 diories
  #   And content folder has 1 file
  #   And I get url from getContent with 'bafkreihoednm4s2g4vpame3mweewfq5of3hks2mbmkvoksxg3z4rhmweeu'

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

  # Scenario: Delete diory with content
  #   When I call importDioryFromFile with content
  #   And I call deleteDiory with content for last diory
  #   Then diograph.json has 1 diories
  #   And images folder has 0 image
  #   And content folder has 0 file
  #   And last diory has some-diory-id as id
  #   And last diory has "Root diory" as text
