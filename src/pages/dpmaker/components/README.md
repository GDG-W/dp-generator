# DevFest Lagos DP Maker - Component Structure

## Overview
The DP Maker application has been refactored into separate, modular components for better maintainability and organization.

## Component Architecture

### Main Component
- **DPMaker.tsx** - Main container component that orchestrates the upload flow and state management

### Sub-Components

#### 1. Upload Component (`components/Upload.tsx`)
**Purpose**: Handles file upload functionality
- Drag and drop file upload
- Click to upload
- File validation (PNG/JPEG only)
- Visual feedback for drag states

**Props**:
- `onImageUpload: (image: string) => void` - Callback when image is uploaded

#### 2. Crop Component (`components/Crop.tsx`)
**Purpose**: Interactive image cropping functionality
- Draggable crop selection area
- Resizable crop handles (corner resize)
- Real-time crop preview
- Canvas-based image cropping

**Props**:
- `image: string` - Image URL to crop
- `onCrop: (croppedImage: string) => void` - Callback with cropped image data
- `onReplacePhoto: () => void` - Callback to go back to upload

#### 3. AICustomize Component (`components/AICustomize.tsx`)
**Purpose**: Final customization step with AI styling options
- User name input
- Gemini AI styling checkbox
- AI prompt input (when enabled)
- Generate DP functionality

**Props**:
- `image: string` - Final image to display
- `userName: string` - Current user name value
- `onUserNameChange: (name: string) => void` - User name change handler
- `onGenerateDP: () => void` - Final generation callback

## State Flow

1. **Upload** → User uploads image → `handleImageUpload` → Navigate to Edit
2. **Edit/Crop** → User crops image → `handleImageCrop` → Navigate to Customize  
3. **Customize** → User fills form → `handleGenerateDP` → Final DP generation

## File Structure
```
src/pages/dpmaker/
├── DPMaker.tsx           # Main component
├── dpmaker.css          # Main styles
├── dpai.css             # AI/customize styles
├── dpcrop.css           # Crop functionality styles
└── components/
    ├── index.ts         # Component exports
    ├── Upload.tsx       # Upload component
    ├── Crop.tsx         # Crop component
    └── AICustomize.tsx  # AI customization component
```

## Benefits of This Structure

1. **Separation of Concerns**: Each component handles a specific part of the workflow
2. **Reusability**: Components can be easily reused or modified independently
3. **Maintainability**: Easier to debug and maintain individual features
4. **Testing**: Each component can be unit tested independently
5. **Readability**: Cleaner, more focused code in each file

## CSS Files
The CSS files remain in the parent directory and are imported into the main component:
- `dpmaker.css` - General layout and styling
- `dpcrop.css` - Crop-specific styles (overlays, handles, etc.)
- `dpai.css` - AI form and styling components
