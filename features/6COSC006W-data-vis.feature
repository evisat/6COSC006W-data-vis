Feature: 6COSC006W-data-vis
    As a user, I want to view the website and scroll down to see the different sections and charts

Scenario: Mobile view
    Given I am using a device with a screen size less than 1280px
    When I visit the website
    Then I should only see a device incompatible message

Scenario: Desktop view
    Given I am using a device with a screen size higher than 1280px
    When I visit the website
    Then I should see the title of the project
    And I should be able to scroll down the site to view content

Scenario: Scatterplot section - in view
    Given I have loaded the website on a desktop device
    When I scroll to the scatterplot section
    Then I should see descriptive text appear on the right-hand side
    And I should see all scatter charts populated with data for courses in Cavendish campus

Scenario: Scatterplot section - select campus
    Given I have scrolled to the scatterplot section
    When I select a different campus
    Then I should see the scatterplots re-populate with data for the course in that selected campus

Scenario: Scatterplot section - scrolling in section
    Given I have scrolled to the scatterplot section
    When I scroll down to see all the charts
    Then the descriptive text should scroll with the page
    And when I get to the end of the section, the text should stop moving

Scenario: Prediction section
    Given I have loaded the website on a desktop device
    When I scroll to the prediction section
    Then I should see the descriptive text on the left-hand side
    And I should see one scatter chart on the right-hand side showing scatter plots for BA Animation FT
    And I should see a linear regression line on the chart
    And I should see two lines of intersection on the chart

Scenario: Prediction section - select degree type
    Given I have scrolled to the prediction section
    When I select a different degree type from the dropdown options
    Then I should see the chart repopulate with the details for the first-course option in that degree type

Scenario: Prediction section - select course
    Given I have scrolled to the prediction section
    When I select a different course from the dropdown options
    Then I should see the chart repopulate with the details for this course

Scenario: Prediction section - change value on slider
    Given I have scrolled to the prediction section
    When I change the position of the percentage attendance slider
    Then I should see the two lines of intersection change accordingly

Scenario: Donut charts section
    Given I have loaded the website on a desktop device
    When I scroll to the donut chart section
    Then I should see descriptive text appear on the top right-hand side
    And I should see three donut charts populated with data for the degree type BA

Scenario: Horizontal charts section - in view
    Given I have loaded the website on a desktop device
    When I scroll to the horizontal chart section
    Then I should see descriptive text appear on the right-hand side
    And I should see all horizontal charts populated with the data

Scenario: Horizontal charts section - scrolling in section
    Given I have scrolled to the horizontal charts section
    When I scroll down to see all the charts
    Then the descriptive text should scroll with the page
    And when I get to the end of the section, the text should stop moving

Scenario: Waffle chart section
    Given I have loaded the website on a desktop device
    When I scroll to the waffle chart section
    Then I should see descriptive text appear on the top right-hand side
    And I should see three donut charts populated with data for the degree type BA
