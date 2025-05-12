import React from 'react';

/**
 * A responsive container component that adapts to different screen sizes
 * with consistent padding and max-width
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.maxWidth - Maximum width (default 'max-w-7xl')
 * @param {boolean} props.withPadding - Add default padding (default true)
 * @param {boolean} props.centerContent - Center the content (default false)
 * @param {string} props.role - ARIA role for the container
 * @param {string} props.id - ID for the container
 */
export default function ResponsiveContainer({ 
  children,
  className = "",
  maxWidth = "max-w-7xl",
  withPadding = true,
  centerContent = false,
  role = "region",
  id,
  ...restProps
}) {
  return (
    <div 
      id={id}
      role={role}
      className={`
        ${maxWidth} mx-auto 
        ${withPadding ? 'px-4 sm:px-6 lg:px-8' : ''} 
        ${centerContent ? 'flex flex-col items-center' : ''}
        ${className}
      `}
      {...restProps}
    >
      {children}
    </div>
  );
}
