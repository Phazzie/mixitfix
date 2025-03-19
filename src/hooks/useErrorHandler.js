import { useState, useEffect } from 'react';

/**
 * @module useErrorHandler
 * @description This hook manages an error state and clears it after a set duration.
 * It provides a way to set an error message and automatically clear it after 5 seconds.
 * @returns {array} An array containing:
 *   - error: The current error message, or null if there is no error.
 *   - setError: A function to update the error state.
 */
function useErrorHandler() {
  // State to store the current error.
  const [error, setError] = useState(null);

  // Effect to clear the error after 5 seconds if it's not null.
  useEffect(() => {
    // If there is an error, clear it after 5 seconds.
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      // Clear the timer when the component unmounts or the error changes.
      return () => clearTimeout(timer);
    }
    // Re-run the effect if the error changes.
  }, [error]);

  return [error, setError];
}

export default useErrorHandler;