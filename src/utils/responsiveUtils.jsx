/**
 * Common responsive utilities for consistent layouts across the application
 */

// Grid layout patterns
export const gridLayouts = {
  // Basic responsive grid that adjusts columns based on screen size
  adaptive: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6",
  
  // Grid specifically for cards with more space on larger screens
  cards: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6",
  
  // Dashboard style grid with larger left area and smaller right area
  dashboard: "grid grid-cols-1 lg:grid-cols-3 gap-6",
  
  // Form layout with section headers and content areas
  form: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6",
};

// Typography scales
export const typography = {
  // Main page heading
  heading: "text-xl sm:text-2xl md:text-3xl font-bold text-gray-900",
  
  // Section headings
  subheading: "text-lg sm:text-xl font-bold text-gray-900",
  
  // Regular body text
  paragraph: "text-base text-gray-800",
  
  // Small text for captions, info, etc.
  small: "text-xs sm:text-sm text-gray-600",
};

// Consistent spacing for sections
export const spacing = {
  section: "mb-6 sm:mb-8 lg:mb-10",
  card: "p-4 sm:p-6",
};

// Flex layout utilities
export const flexLayouts = {
  // Vertically stacked on mobile, horizontal on larger screens
  row: "flex flex-col sm:flex-row",
  
  // Space between items
  spaceBetween: "flex justify-between items-center",
  
  // Center items
  center: "flex justify-center items-center",
  
  // End-aligned items
  end: "flex justify-end items-center",
};
