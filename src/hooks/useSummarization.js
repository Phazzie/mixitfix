import { useState } from 'react';

/**
 * @module useSummarization
 * @description This module provides the useSummarization custom hook.
 * It encapsulates the logic for handling the AI summarization process, including making the API request,
 * managing the AI response, and handling API errors.
 */

/**
 * @function useSummarization
 * @description Custom hook that encapsulates the logic for handling the AI summarization process.
 * @param {function} getMostRecentStatement - A function to retrieve the most recent statement for a given user.
 * @param {string} code - The code of the current session.
 * @description The code is used to access the correct statements in the local storage.
 * @returns {object} An object containing the aiResponse, apiError, and handleSummarizeClick.
 */
function useSummarization(getMostRecentStatement, code) {
  // State to store the AI’s response.
  const [aiResponse, setAiResponse] = useState('');
  // State for storing error messages from the API.
  const [apiError, setApiError] = useState('');

  /**
   * @function handleSummarizeClick
   * @description Handles the click event for the "Summarize with AI" button.
   * Retrieves the most recent statements for both users, sends them to the backend API for summarization,
   * and updates the UI with the AI's response or any errors.
   */
  const handleSummarizeClick = async () => {
    // Reset the AI response and error states before fetching a new summary.
    setAiResponse('');
    setApiError('');
    // Retrieve the most recent statements for both participants.
    const user1Statement = getMostRecentStatement(code, "Participant 1");
    const user2Statement = getMostRecentStatement(code, "Participant 2");
    // If either statement is missing, log an error and return.
    if (!user1Statement || !user2Statement) {
      setApiError('Both participants must submit a statement before summarizing.');
      // Exit the function early if there is no statement.
      return;
    }

    try {
      // Send a POST request to the /api/ai-summarize endpoint with both statements.
      // Include the current code in the body.
      const response = await fetch('/api/ai-summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the statements and the code to the api.
        // The code is used to access the correct statements in the local storage.
        body: JSON.stringify({ user1Statement, user2Statement, code }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errorMessage || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
      
      // Parse the JSON response from the API
      const data = await response.json();
      // Check if the response contains the aiResponse.
      if (data.aiResponse) {
        setAiResponse(data.aiResponse);
      } else {
        // Throw an error if the aiResponse is missing.
        setApiError('Response missing aiResponse');
        throw new Error('Response missing aiResponse');
      }
      setApiError('');
    } catch (error) {
      // Log the error to the console for debugging.
      // This is useful for development.
      console.error('Error during AI summarization:', error);
      
      if (error.message === 'Response missing aiResponse') {
        setApiError('The summarization could not be performed.');
      } else if (error.message.includes('Failed to fetch')) {
        setApiError('Failed to connect to the server. Please check your network connection.');
      } else if (error.message.includes('HTTP error')) {
        const errorMessage = error.message.includes('message:') ? error.message.split('message: ')[1] : error.message;
        setApiError('An error occurred while communicating with the server. Please try again. ' + errorMessage);
      } else {
        // set the api error to display an error to the user.
        setApiError('An unexpected error occurred while trying to summarize. Please try again.' + error.message);
      }
    }
  };

  return { aiResponse, apiError, handleSummarizeClick };
}

export default useSummarization;