Feature: 6COSC006W-data-vis
    As a user I want to scroll down the page and be displayed
    with charts and texts depending on the section I am in

# for each graph get a value and depending on radio button or dropdown selection, what the value should be.
    # Scenario: Core content view
    #     Given I am using a browser which does not cut the mustard
    #     When I visit the moped crime lookup
    #     Then I should only see the core content
    #     And I should see a list of 5 popular wards
    #     And I should see the crime statistics for each ward
    #
    # Scenario: News app
    #     Given I am using the News app
    #     When I touch the app image to open the widget
    #     Then the interactive will be loaded
    #
    # Scenario: Full experience
    #     Given I am using a browser which cuts the mustard
    #     When I visit the moped crime lookup
    #     Then I should see a postcode input field
    #     And I should see a list of popular locations as links
    #     And I should see a map of all wards in the greater London area
    #
    # Scenario: Submitting the form with a valid London postcode
    #     Given I have entered valid information in the postcode field
    #     When I click the submit button or hit ENTER, the relevant ward info should be retrieved
    #     And the results section should become visible
    #     And I should be scrolled down to the top of the results section
    #     And I should see the 'Showing results for [WARD NAME]'
    #     And I should see the ward's rank and 'crime meter'
    #     And the meter should show high, medium or low
    #     And I should see the crimes broken down into years in a bar chart
    #     And I should see the most dangerous roads listed
    #     And I should see a ward map image
    #     And I should see the crimes type figures in a horizontal bar chart
    #     And the bar chart should animate when it scrolls into view
    # Examples:
    # |postcode|  wardName      |rank|meter |totalCrimes|crimes2017|roadCrimes| road(s)|criminalDamage|other|robbery|burglary|theftHandling|violence|
    # |CR20AT  |Sanderstead     | 654|high  | 0         | 0        | 0        | 0      | 0            | 0   | 0     | 0      | 0           | 0      |
    # |UB108ES |Ickenham        | 566|low   | 3         | 1        | 1        | 3      | 1            | 0   | 0     | 0      | 1           | 1      |
    # |W1A1ER  |Clerkenwell     | 5  |high  | 1241      | 716      | 82       | 1      | 2            | 3   | 148   | 14     | 1063        | 11     |
    # |SM54PN  |Wallington South| 533|low   | 4         | 3        | 0        | 1      | 0            | 0   | 1     | 0      | 1           | 2      |
    # |UB54LD  |Greenford Green | 447|low   | 7         | 4        | 0        | 0      | 0            | 0   | 0     | 1      | 5           | 5      |
    # |E50AF   |King's park     | 473|low   | 6         | 6        | 0        | 0      | 0            | 0   | 6     | 0      | 0           | 0      |
    # |SE151NQ |Nunhead         | 228|middle| 26        | 12       | 4        | 1      | 0            | 0   | 7     | 1      | 15          | 3      |
    #
    # Scenario: Submitting the form with invalid information
    #     Given I have not entered a valid postcode
    #     When I try to view the results
    #     Then I should see an error message
    #     And the results section should remain hidden
    #
    # Scenario: Click a popular area link
    #     Given I am viewing the full experience
    #     When I have clicked one of the popular tourist destination links
    #     Then I should be shown the results for the relevant ward
    #     And the values in the postcode input should be unaffected/unchanged
    #
    # Scenario: The chosen ward has zero moped crimes
    #     Given I have chosen a valid London ward
    #     And I can see the results section
    #     And the ward has zero crime total or no crime type data
    #     Then I should see a meesage saying the ward did not record any moped crimes between 2012 and 2017
    #     And I should not see the crimes broken down into years
    #     And I should not see the mosted dangerous roads listed
    #     And I should not see a ward map
    #     And I should not see the crimes broken down into types
    #
    # Scenario: The chosen ward has crimes but no roads listed
    #     Given I have chosen a valid London ward
    #     And I can see the results section
    #     And the ward has valid crime totals
    #     And the ward does not have any dangerous roads listed
    #     Then I should not see the dangerous roads sections
    #
    # Scenario: AMP
    #     Given I am using the AMP version in a supported browser
    #     When I touch the app image to open the widget
    #     Then the interactive will be loaded
    #     And when I submit the form
    #     Then I should not be scrolled down to the results section
