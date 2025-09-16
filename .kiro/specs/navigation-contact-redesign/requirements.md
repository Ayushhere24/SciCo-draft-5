# Requirements Document

## Introduction

This feature involves redesigning the SciCo website navigation and replacing existing sections with a new Contact Us page. The changes include removing the Podcasts and Connect sections, updating the navigation bar with a premium glass design, and creating a new Contact Us page with podcast thumbnails slider and brand logo scroller.

## Requirements

### Requirement 1

**User Story:** As a website visitor, I want a streamlined navigation experience with clear sections, so that I can easily find the content I'm looking for.

#### Acceptance Criteria

1. WHEN the user views the website THEN the navigation SHALL display only "Home · About · Explorations · Contact Us" links
2. WHEN the user views the navigation bar THEN it SHALL have a transparent dark-cyan background with rgba(0,180,190,.16)
3. WHEN the user views the navigation bar THEN it SHALL have a 12px blur effect and 1px cyan border with 30% opacity
4. WHEN the user views the navigation bar THEN it SHALL be rounded-full with white text and z-index of 50
5. WHEN the user views the navigation bar THEN it SHALL be positioned sticky at the top-center of the page

### Requirement 2

**User Story:** As a website visitor, I want to see podcast content in an engaging slider format, so that I can discover available podcast episodes.

#### Acceptance Criteria

1. WHEN the user visits the Contact Us page THEN they SHALL see a "Podcast" heading in the top section
2. WHEN the user views the podcast section THEN they SHALL see a slider with thumbnail1 through thumbnail6 images
3. WHEN the user views the podcast slider THEN it SHALL autoplay with 4-6 second intervals
4. WHEN the user views the podcast slider THEN it SHALL loop infinitely without jerky transitions
5. WHEN the user hovers over the podcast slider THEN it SHALL pause autoplay
6. WHEN the user is on mobile THEN they SHALL be able to swipe through podcast thumbnails
7. WHEN the user views podcast thumbnails THEN they SHALL have 16:9 aspect ratio with 22px border radius
8. WHEN the user views podcast thumbnails THEN they SHALL have a 1px border with rgba(70,230,230,.2) color
9. WHEN the user views podcast thumbnails THEN they SHALL have a box-shadow of 0 8px 24px rgba(0,0,0,.35)
10. WHEN the user hovers over podcast thumbnails THEN they SHALL lift 1-2% with a faint cyan glow

### Requirement 3

**User Story:** As a potential podcast guest, I want to easily contact the team about appearing on the podcast, so that I can express my interest.

#### Acceptance Criteria

1. WHEN the user views the podcast section THEN they SHALL see the text "Want to be our guest in podcast?"
2. WHEN the user views the podcast section THEN they SHALL see a cyan pill-shaped "Contact Us" button
3. WHEN the user clicks the Contact Us button THEN they SHALL be able to initiate contact

### Requirement 4

**User Story:** As a website visitor, I want to see the brands that SciCo has worked with, so that I can understand their credibility and experience.

#### Acceptance Criteria

1. WHEN the user views the Contact Us page THEN they SHALL see a "Brands we have worked with" heading in the bottom section
2. WHEN the user views the brands section THEN they SHALL see a continuous horizontal logo scroller
3. WHEN the user views the brand logos THEN they SHALL scroll seamlessly without jerky transitions
4. WHEN the user views the brand logos THEN they SHALL have the same premium styling as podcast thumbnails
5. WHEN the user views the brand logos THEN they SHALL have 12-16px gaps between them

### Requirement 5

**User Story:** As a website visitor, I want the Contact Us page to have a premium, sleek design that matches the SciCo brand, so that I have a professional experience.

#### Acceptance Criteria

1. WHEN the user views the Contact Us page THEN it SHALL have a black background with premium, sleek, and calming design
2. WHEN the user views the Contact Us page THEN it SHALL use a vertical layout structure
3. WHEN the user views text on the Contact Us page THEN it SHALL be 18-22px size with white text at 85% opacity
4. WHEN the user views the Contact Us page THEN it SHALL have generous spacing between elements
5. WHEN the user views images on the Contact Us page THEN they SHALL use object-fit: cover with subtle glass frame styling

### Requirement 6

**User Story:** As a website administrator, I want the Podcasts and Connect sections removed from the main page, so that the site focuses on the new Contact Us experience.

#### Acceptance Criteria

1. WHEN the user views the main website THEN the Podcasts section SHALL not be displayed
2. WHEN the user views the main website THEN the Connect section SHALL not be displayed
3. WHEN the user views the navigation THEN the Podcasts and Connect links SHALL not be present
4. WHEN the user navigates through the site THEN only Home, About, Explorations, and Contact Us sections SHALL be accessible