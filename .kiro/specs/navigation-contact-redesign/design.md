# Design Document

## Overview

This design transforms the SciCo website by removing the Podcasts and Connect sections from the main page, updating the navigation to a streamlined 4-item menu, and creating a dedicated Contact Us page with premium podcast and brand showcase sections. The design maintains the existing glassmorphic aesthetic while introducing new interactive elements.

## Architecture

### Component Structure
```
App.tsx (updated)
├── Navbar.tsx (updated - remove Podcasts/Connect links)
├── HomeSection.tsx (existing)
├── AboutSection.tsx (existing) 
├── ExplorationsSection.tsx (existing)
└── ContactUsPage.tsx (new)
    ├── PodcastSlider.tsx (new)
    └── BrandScroller.tsx (new)
```

### Routing Strategy
The application will use hash-based routing for smooth scrolling navigation:
- `#home` → HomeSection
- `#about` → AboutSection  
- `#explorations` → ExplorationsSection
- `#contact` → ContactUsPage

## Components and Interfaces

### Updated Navbar Component
**Purpose:** Streamlined navigation with premium glass styling
**Changes:**
- Remove "Podcasts" and "Connect" navigation items
- Update navigation to: Home · About · Explorations · Contact Us
- Maintain existing glassmorphic styling (already matches requirements)

### ContactUsPage Component
**Purpose:** New dedicated page with podcast slider and brand showcase
**Props Interface:**
```typescript
interface ContactUsPageProps {
  className?: string;
}
```

### PodcastSlider Component  
**Purpose:** Infinite carousel showcasing podcast thumbnails
**Props Interface:**
```typescript
interface PodcastSliderProps {
  thumbnails: string[];
  autoplayInterval?: number; // 4000-6000ms
  className?: string;
}

interface SliderState {
  currentIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
}
```

**Key Features:**
- Infinite loop with seamless transitions using transform3d for GPU acceleration
- Duplicate slides technique for no-jerk looping
- Pause on hover, resume on mouse leave
- Touch/swipe support for mobile using touch events
- Intersection Observer for performance optimization

### BrandScroller Component
**Purpose:** Continuous horizontal scrolling of brand logos
**Props Interface:**
```typescript
interface BrandScrollerProps {
  logos: string[];
  scrollSpeed?: number;
  className?: string;
}
```

**Key Features:**
- CSS animation-based continuous scroll
- Duplicate content for seamless infinite loop
- GPU-accelerated transforms
- Responsive logo sizing

## Data Models

### Thumbnail Data
```typescript
interface ThumbnailItem {
  id: string;
  src: string;
  alt: string;
}

const podcastThumbnails: ThumbnailItem[] = [
  { id: '1', src: '/images/thumbnail 1.jpg', alt: 'Podcast Episode 1' },
  { id: '2', src: '/images/thumbnail 2.jpg', alt: 'Podcast Episode 2' },
  { id: '3', src: '/images/thumbnail 3.jpg', alt: 'Podcast Episode 3' },
  { id: '4', src: '/images/thumnail 4.jpg', alt: 'Podcast Episode 4' },
  { id: '5', src: '/images/thumbnail 5.jpg', alt: 'Podcast Episode 5' },
  { id: '6', src: '/images/thumnail 6.jpg', alt: 'Podcast Episode 6' }
];
```

### Brand Data
```typescript
interface BrandItem {
  id: string;
  src: string;
  alt: string;
  name: string;
}

// Will use existing brands.png or individual brand logos if available
```

## Styling Architecture

### CSS Custom Properties
```css
:root {
  --contact-bg: #000000;
  --contact-text: rgba(255, 255, 255, 0.85);
  --contact-heading-size: 22px;
  --contact-body-size: 18px;
  --contact-spacing: 2rem;
  --image-border-radius: 22px;
  --image-border: 1px solid rgba(70, 230, 230, 0.2);
  --image-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  --image-gap: 16px;
  --hover-lift: translateY(-2%);
  --hover-glow: 0 0 20px rgba(70, 230, 230, 0.3);
}
```

### Premium Image Styling
```css
.premium-image {
  object-fit: cover;
  aspect-ratio: 16/9;
  border-radius: var(--image-border-radius);
  border: var(--image-border);
  box-shadow: var(--image-shadow);
  transition: transform 300ms ease, box-shadow 300ms ease;
}

.premium-image:hover {
  transform: var(--hover-lift);
  box-shadow: var(--image-shadow), var(--hover-glow);
}
```

### Layout System
- **Contact Us Page:** CSS Grid with vertical flow
- **Podcast Section:** Flexbox for slider container, CSS transforms for slides
- **Brand Section:** Flexbox with overflow hidden for scroller
- **Responsive:** CSS Grid areas and flexbox for mobile adaptation

## Animation Strategy

### Podcast Slider Animation
```css
@keyframes slideInfinite {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}

.slider-track {
  animation: slideInfinite var(--slide-duration) linear infinite;
  will-change: transform;
}

.slider-track.paused {
  animation-play-state: paused;
}
```

### Brand Scroller Animation  
```css
@keyframes scrollBrands {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}

.brand-scroller {
  animation: scrollBrands 30s linear infinite;
  will-change: transform;
}
```

## Error Handling

### Image Loading
- Implement lazy loading with Intersection Observer
- Fallback placeholder images for failed loads
- Progressive enhancement for touch/swipe features

### Animation Fallbacks
- Respect `prefers-reduced-motion` media query
- Graceful degradation for older browsers
- CSS-only fallbacks for JavaScript failures

### Touch/Swipe Handling
```typescript
// Error boundaries for touch event handling
try {
  element.addEventListener('touchstart', handleTouchStart, { passive: true });
} catch (error) {
  console.warn('Touch events not supported:', error);
  // Fallback to mouse events only
}
```

## Testing Strategy

### Unit Tests
- **PodcastSlider:** Test autoplay, pause/resume, infinite loop logic
- **BrandScroller:** Test continuous scroll, responsive behavior  
- **ContactUsPage:** Test layout rendering, responsive breakpoints

### Integration Tests
- **Navigation:** Test smooth scrolling to Contact Us section
- **Image Loading:** Test lazy loading and error states
- **Touch Interactions:** Test swipe gestures on mobile devices

### Visual Regression Tests
- **Premium Styling:** Verify glass effects, shadows, hover states
- **Responsive Design:** Test layout across device sizes
- **Animation Performance:** Verify smooth 60fps animations

### Accessibility Tests
- **Keyboard Navigation:** Test slider controls with keyboard
- **Screen Readers:** Verify proper ARIA labels and descriptions
- **Motion Preferences:** Test reduced motion compliance

## Performance Considerations

### Optimization Strategies
- **GPU Acceleration:** Use `transform3d()` for all animations
- **Lazy Loading:** Implement Intersection Observer for images
- **Memory Management:** Clean up animation intervals and event listeners
- **Bundle Splitting:** Code-split Contact Us page if needed

### Metrics to Monitor
- **First Contentful Paint:** Contact Us page load time
- **Animation Frame Rate:** Maintain 60fps for sliders
- **Memory Usage:** Monitor for memory leaks in infinite animations
- **Touch Response Time:** <100ms for swipe interactions