import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * @module useStatementLoader
 * @description This hook is responsible for loading statements from local storage for a given code.
 * It handles any potential errors that occur during the process and provides a loading state.
 * It uses the `useLocalStorage` hook to access local storage.
 * @param {string} initialCode - The initial code to use to load statements.
 * @returns {array} An array containing:
 *   - statements: An array of statements loaded from local storage.
 *   - loadStatements: A function to load statements for a given code.
 *   - error: An error object if an error occurred, null otherwise.
 *   - loading: A boolean indicating if the statements are currently being loaded.
 */
function useStatementLoader(initialCode) {
  // Use the useLocalStorage hook to manage the statements in local storage.
  // We are only getting the setStatements function, since we don't want to get data from here.
  const [, setStatements] = useLocalStorage();
  // State to store the loaded statements.
  const [statements, setStatementsState] = useState([]);
  // State to store any errors that occur.
  const [error, setError] = useState(null);
  // State to track if the statements are currently being loaded.
  const [loading, setLoading] = useState(false);

  /**
   * @function loadStatements
   * @description Loads statements from local storage for a given code.
   * @param {string} code - The code to load statements for.
   * @async
   */
  const loadStatements = async (code) => {
    // Reset the error state.
    setError(null);
    // Set the loading state to true.
    setLoading(true);
    try {
      // If a code is provided, load statements from local storage.
      if (code) {
        const storedStatements = localStorage.getItem(code);
        if (storedStatements) {
          // Parse the statements from JSON.
          const parsedStatements = JSON.parse(storedStatements);
          // If there are statements, update the state.
          if (parsedStatements?.length > 0) {
            setStatementsState(parsedStatements);
            // Update the statements in local storage, if they changed.
            setStatements(parsedStatements)
          }
        } else {
          // If there are no statements for the given code, set an error message.
          setError('No statements found for this code.');
          setStatementsState([]);
        }
      }
    } catch (err) {
      // If an error occurs, set the error state.
      setError(`Error loading statements: ${err.message}`);
    } finally {
      // Set the loading state to false.
      setLoading(false);
    }
  };

  // Load statements when the initial code changes.
  useEffect(() => {
    loadStatements(initialCode);
    // Re-run the effect if the initial code changes.
  }, [initialCode]);

  return [statements, loadStatements, error, loading];
}

export default useStatementLoader;