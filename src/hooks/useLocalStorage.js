import { useState, useEffect } from 'react';

/**
 * Custom hook to manage state that is synchronized with localStorage.
 * This hook was created to encapsulate localStorage interaction, improving code reuse,
 * maintainability, and consistency in how localStorage is accessed across the application.
 */
function useLocalStorage(key) {
  /**
   * Initializes the state with a value from localStorage or null if not found.
   * @returns {any} The initial state value, retrieved from localStorage or null.
   */
  const [value, setValue] = useState(() => {
    try {
      // Attempt to get the item from localStorage.
      const item = localStorage.getItem(key);
      // If an item is found, parse it from JSON to a JavaScript object.
      return item ? JSON.parse(item) : null;
    } catch (error) {
      // If an error occurs (e.g., localStorage is unavailable), log it.
      console.error("Error getting from localStorage:", error);
      // rethrow the error so the caller knows there was an issue.
      throw error;
    }
  });

  /**
   * Effect to synchronize state changes with localStorage.
   * Runs whenever the key or value changes.
   */
  useEffect(() => {
    try {
      // Attempt to set the value to localStorage as a JSON string.
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // If an error occurs (e.g., localStorage is full), log it.
      console.error("Error setting to localStorage:", error);
      // rethrow the error so the caller knows there was an issue.
      throw error;
    }
    //re-run this effect if key or value changes.
  }, [key, value]);

  /**
   * @returns {[any, function]} An array containing the current value and a function to update the value.
   * @param {string} key - The localStorage key to be used for storage.
   * @param {any} value - The value to be stored. Can be any JSON serializable value.
   */
  return [value, setValue]; 
}

export default useLocalStorage;