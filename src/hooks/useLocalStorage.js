import { useState, useEffect } from 'react';

/**
 * @module useLocalStorage
 * @description Custom hook to manage state that is synchronized with localStorage.
 * This hook was created to encapsulate localStorage interaction, improving code reuse,
 * maintainability, and consistency in how localStorage is accessed across the application.
 * @function useLocalStorage
 * @param {string} key - The localStorage key to be used for storage.
 * @returns {array} An array containing the current value and a function to update the value.
 * @example
 * const [myValue, setMyValue] = useLocalStorage('myKey');
 * setMyValue('newValue');
 * const [myObject, setMyObject] = useLocalStorage('myObject');
 * setMyObject({ name: 'John', age: 30 });
 */
function useLocalStorage(key) {
  // the setStatements function.
  const setStatements = (value) => {
    setValue(value);
  };
  /**
   * @function 
   * @param {string} key - The localStorage key to be used for storage.
   * @param {any} initialValue - The initial value to be used if there is no value stored in local storage.
   * @description Initializes the value state with a value from localStorage or null if not found.
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
   * @function
   * @param {string} key - The localStorage key to be used for storage.
   * @param {any} value - The value to be stored in local storage.
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
    // Re-run this effect if key or value changes.
  }, [key, value]);

  //create a loading state.
  const [loading, setLoading] = useState(true)
  // create an error state.
  const [error, setError] = useState(null);
  /**
   * @returns {[any, function]} An array containing the current value and a function to update the value.
   * @param {string} key - The localStorage key to be used for storage.
   * @param {any} value - The value to be stored. Can be any JSON serializable value, or null.
   */
  return [value, setStatements, loading, error];
}
export default useLocalStorage;