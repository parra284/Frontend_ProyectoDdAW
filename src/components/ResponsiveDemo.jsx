import React from 'react';
import Navbar from '../components/Navbar';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ResponsiveHelper from '../components/ResponsiveHelper';
import { gridLayouts, typography, spacing } from '../utils/responsiveUtils';

/**
 * A demo page showcasing responsive design elements
 */
export default function ResponsiveDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Enable the responsive helper during development */}
      <ResponsiveHelper enabled={true} />
      
      <main id="main-content">
        <ResponsiveContainer className="py-6 lg:py-10">
          <header role="banner">
            <h1 className={`${typography.heading} mb-2`}>
              Responsive Design Demo
            </h1>
            <p className={`${typography.paragraph} text-gray-600 mb-6`}>
              This page demonstrates our responsive design system
            </p>
          </header>

          <section 
            className={`${spacing.section} bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm`}
            aria-labelledby="responsive-grid-heading"
          >
            <h2 
              id="responsive-grid-heading" 
              className={`${typography.subheading} mb-4`}
            >
              Responsive Grid
            </h2>
            
            <div className={gridLayouts.adaptive} role="list">
              {Array.from({ length: 6 }).map((_, i) => (
                <div 
                  key={i}
                  className="bg-blue-100 border border-blue-300 rounded-lg p-4 h-32 flex items-center justify-center shadow-sm"
                  role="listitem"
                >
                  Item {i + 1}
                </div>
              ))}
            </div>
            
            <p className="text-gray-500 text-sm mt-3">
              This grid adapts from 1 column on mobile to 4 columns on extra-large screens.
            </p>
          </section>
          
          <section 
            className={`${spacing.section} bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm`}
            aria-labelledby="responsive-form-heading"
          >
            <h2 
              id="responsive-form-heading" 
              className={`${typography.subheading} mb-4`}
            >
              Responsive Form Layout
            </h2>
            
            <form 
              className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
              aria-labelledby="responsive-form-heading"
            >
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  id="firstName"
                  type="text" 
                  name="firstName"
                  placeholder="Enter first name" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  id="lastName"
                  type="text" 
                  name="lastName"
                  placeholder="Enter last name" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  aria-required="true"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  id="email"
                  type="email" 
                  name="email"
                  placeholder="Enter email address" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  aria-required="true"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </section>
          
          <section 
            className={`${spacing.section} bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm`}
            aria-labelledby="responsive-typography-heading"
          >
            <h2 
              id="responsive-typography-heading" 
              className={`${typography.subheading} mb-4`}
            >
              Responsive Typography
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
                  This is a responsive heading
                </h3>
                <p className="text-gray-500 text-xs">text-base sm:text-lg md:text-xl lg:text-2xl</p>
              </div>
              
              <div>
                <p className="text-sm sm:text-base md:text-lg">
                  This paragraph text adjusts to be comfortable to read on any device.
                </p>
                <p className="text-gray-500 text-xs">text-sm sm:text-base md:text-lg</p>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm">
                  This small text is still readable across devices.
                </p>
                <p className="text-gray-500 text-xs">text-xs sm:text-sm</p>
              </div>
            </div>
          </section>
          
          <section 
            className={`${spacing.section} bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm`}
            aria-labelledby="responsive-card-layout-heading"
          >
            <h2 
              id="responsive-card-layout-heading" 
              className={`${typography.subheading} mb-4`}
            >
              Responsive Card Layout
            </h2>
            
            <div className="sm:flex sm:space-x-4">
              <div className="mb-4 sm:mb-0 sm:w-1/2 bg-blue-50 p-4 rounded-lg border border-blue-100" role="region" aria-label="Card 1">
                <h3 className="font-medium mb-2">Card 1</h3>
                <p className="text-sm text-gray-600">
                  On mobile, these cards stack vertically. On larger screens, they appear side by side.
                </p>
              </div>
              <div className="sm:w-1/2 bg-green-50 p-4 rounded-lg border border-green-100" role="region" aria-label="Card 2">
                <h3 className="font-medium mb-2">Card 2</h3>
                <p className="text-sm text-gray-600">
                  Using flexbox to create responsive layouts that work on all devices.
                </p>
              </div>
            </div>
          </section>
          
          <section 
            className={`${spacing.section}`}
            aria-labelledby="responsive-images-heading"
          >
            <h2 
              id="responsive-images-heading" 
              className={`${typography.subheading} mb-4`}
            >
              Responsive Images
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <img 
                  src="https://via.placeholder.com/600x400" 
                  alt="Placeholder image example 1" 
                  className="w-full h-40 object-cover rounded-lg shadow-sm"
                  loading="lazy"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">w-full h-40 object-cover</p>
              </div>
              
              <div className="md:col-span-2">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src="https://via.placeholder.com/1200x800" 
                    alt="Placeholder image example 2" 
                    className="w-full h-full object-cover rounded-lg shadow-sm"
                    loading="lazy"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">aspect-w-16 aspect-h-9</p>
              </div>
            </div>
          </section>
        </ResponsiveContainer>
        
        <footer 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 border-t pt-6 text-center text-gray-500 text-sm"
          role="contentinfo"
        >
          <p>This demo showcases the responsive features built into our application.</p>
        </footer>
      </main>
    </div>
  );
}
