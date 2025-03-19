import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * @module useStatements
 * @description This module provides the useStatements custom hook.
 * It encapsulates the logic for managing user statements, including:
 * - Managing the discussion code.
 * - Retrieving the most recent statement.
 * - Determining if the AI summarization button should be enabled.
 */

/**
 * @function useStatements
 * @description Custom hook that encapsulates the logic for managing user statements.
 * @returns {object} An object containing the code, setCode, canSummarize, and getMostRecentStatement.
 */
const useStatements = () => {
  // Custom hook to manage the generated code in local storage,
  // which groups discussions and allows us to get, set and remove the data.
  const [code, setCode] = useLocalStorage('generatedCode', '');
  // State to determine if the AI summarization button should be enabled.
  const [canSummarize, setCanSummarize] = useState(false);

  /**
   * @function getMostRecentStatement
   * @description Retrieves the most recent statement for a given user from local storage.
   * @param {string} currentCode - The current discussion code (used as the localStorage key).
   * @param {string} user - The user for whom to retrieve the statement (e.g., "Participant 1").
   * @returns {string|null} The most recent statement or null if no statement is found.
    */
  // this function does not need to be a state because it does not change.
  const getMostRecentStatement = (currentCode, user) => {
    // Retrieve the data from localStorage using the currentCode as the key.
    // Returns null if no data is found.
    const data = localStorage.getItem(currentCode);
    // If no data is found for the given code, return null.
    if (!data) return null;
    // Parse the data from JSON format.
    const parsedData = JSON.parse(data);
    // Filter the statements to only include the current user.
    const userStatements = parsedData.filter((item) => item.user === user);
    // If no statements are found for the user, return null.
    if (userStatements.length === 0) return null;
    // Return the text of the most recent statement.
    return userStatements.at(-1).text;
  };

  /**
   * @function useEffect
   * @description Effect hook to update canSummarize whenever the code changes.
   * Checks if both users have submitted a statement and updates canSummarize accordingly.
   * @listens code
   */
  useEffect(() => {
    // Get the most recent statements for each participant.
    const user1Statement = getMostRecentStatement(code, "Participant 1");
    const user2Statement = getMostRecentStatement(code, "Participant 2");
    // Update the canSummarize state based on if both statements exist.
    setCanSummarize(!!user1Statement && !!user2Statement);
    // we are using code as a dependency.
  }, [code]);

  // Return the code, setCode, canSummarize, and getMostRecentStatement.
  return { code, canSummarize, getMostRecentStatement, setCode };
};

export default useStatements;