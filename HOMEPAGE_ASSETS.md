# Homepage Assets Required

This document lists all the assets that need to be added to make the enhanced homepage fully functional.

## Video Assets

### Background Video
- **Path**: `public/videos/hvac-background.mp4`
- **Purpose**: Hero section background video
- **Requirements**: 
  - Format: MP4
  - Recommended resolution: 1920x1080 or higher
  - Should be optimized for web (compressed)
  - Suggested length: 10-30 seconds (will loop)
  - Content: Professional HVAC technician working, modern HVAC equipment, or clean facility shots

## Image Assets

### About Us Section
- **Path**: `public/images/about-us-team.jpg`
- **Purpose**: Team photo for About Us section
- **Requirements**:
  - Format: JPG or PNG
  - Recommended dimensions: 800x400px (2:1 aspect ratio)
  - Content: Professional team photo or office/facility image

### How It Works Section (Interactive Cards with Auto-Advance)

#### Step 1 - Input
- **Path**: `public/images/step1-input.jpg`
- **Purpose**: Illustrates entering model number (displayed when step 1 card is active)
- **Requirements**:
  - Format: JPG or PNG
  - Dimensions: 450x450px (square display, responsive)
  - Content: Person typing on computer, mobile device with input field, or close-up of model number plate

#### Step 2 - Processing
- **Path**: `public/images/step2-process.jpg`
- **Purpose**: Illustrates AI analysis process (displayed when step 2 card is active)
- **Requirements**:
  - Format: JPG or PNG
  - Dimensions: 450x450px (square display, responsive)
  - Content: Abstract representation of AI processing, data visualization, or server/technology imagery

#### Step 3 - Results
- **Path**: `public/images/step3-results.jpg`
- **Purpose**: Illustrates receiving detailed results (displayed when step 3 card is active)
- **Requirements**:
  - Format: JPG or PNG
  - Dimensions: 450x450px (square display, responsive)
  - Content: Screen showing detailed HVAC specifications, happy user reviewing results, or technical documentation

#### Interactive Features
- **Card Layout**: Clean, modern cards with hover effects and smooth transitions
- **Expandable Descriptions**: Card descriptions expand with smooth animations when selected
- **Auto-Advance**: Automatically cycles through steps every 4 seconds
- **Pause on Hover**: Auto-advance pauses when hovering over the cards
- **Manual Selection**: Users can click any card to manually select a step
- **Sticky Image**: Image container stays in view on desktop while scrolling
- **Responsive Design**: Cards stack vertically on mobile with image displayed above

## Placeholder Options

If you don't have custom images immediately available, you can use placeholder services:

1. **For photography**: Use services like Unsplash, Pexels, or stock photo sites
2. **For placeholders**: Use https://via.placeholder.com/ with appropriate dimensions
3. **For HVAC-specific imagery**: Search for "HVAC technician", "air conditioning unit", "commercial HVAC", etc.

## Implementation Notes

- All images should be optimized for web (compressed without losing quality)
- Consider providing WebP versions for better performance
- Ensure images have appropriate alt text for accessibility
- The video should have fallback options for browsers that don't support autoplay

## Current Status

- ✅ Videos directory created (`public/videos/`)
- ❌ Background video needs to be added
- ❌ About Us team image needs to be added
- ❌ How It Works step images need to be added

Once these assets are added, the homepage will be fully functional with all the requested sections:
- Hero with background video ✅
- About Us section ✅
- How It Works (3-step process) ✅
- Our Services section ✅
- Contact Us section ✅ 