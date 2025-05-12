/**
 * Responsive utility functions and constants for the application
 * This file contains shared responsive design utilities
 */

// Breakpoint values match tailwind.config.js
export const breakpoints = {
  sm: 640,  // Mobile devices
  md: 768,  // Tablets
  lg: 1024, // Laptops/Desktops
  xl: 1280, // Large screens
  '2xl': 1536 // Extra large screens
};

// Common container classes with responsive padding
export const containerClasses = {
  default: 'w-full mx-auto px-4 sm:px-6 lg:px-8',
  narrow: 'w-full max-w-3xl mx-auto px-4 sm:px-6',
  wide: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
};

// Grid layout helpers
export const gridLayouts = {
  adaptive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6',
  cards: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4',
  form: 'grid grid-cols-1 md:grid-cols-2 gap-4'
};

// Typography size helpers
export const typography = {
  heading: 'text-xl sm:text-2xl lg:text-3xl font-bold',
  subheading: 'text-lg sm:text-xl font-semibold',
  paragraph: 'text-sm sm:text-base'
};

// Form element responsive classes
export const formElements = {
  container: 'w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto p-4 sm:p-6 md:p-8',
  input: 'w-full p-2 md:p-3 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none',
  button: 'w-full md:w-auto px-4 py-2 md:px-6 md:py-3 rounded font-semibold'
};

// Responsive spacing helpers
export const spacing = {
  section: 'my-4 sm:my-6 md:my-8 lg:my-10',
  element: 'my-2 sm:my-3 md:my-4'
};

// Media query helper for JS components (if needed)
export const mediaQuery = (breakpoint) => {
  return window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`).matches;
};
