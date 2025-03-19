import React from 'react';

/**
 * @module CodeDisplay
 * @description This module provides the CodeDisplay component, which displays the current discussion code.
 */

/**
 * @function CodeDisplay
 * @description CodeDisplay component: Displays the current discussion code.
 * @param {object} props - The component props.
 * @param {string} props.code - The current discussion code.
 * @returns {JSX.Element} The CodeDisplay component.
 */
function CodeDisplay({ code }) {
  return (
    <div>{/* Display the current discussion code. */}
      Current Code: {code}
    </div> // End of current code display.
  );
}
export default CodeDisplay;