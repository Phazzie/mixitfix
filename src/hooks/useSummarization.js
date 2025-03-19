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
      return;
    }

    try {
      const response = await fetch('/api/ai-summarize', {
        // Send a POST request to the /api/ai-summarize endpoint with both statements.
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the user statements in the request body.
        body: JSON.stringify({ user1Statement, user2Statement }),
      });

      // If the response is not ok, throw an error.
      // This will stop the rest of the try block from running and proceed to the catch block.
      if (!response.ok) {
        // Get the error message from the response.
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.errorMessage}`);
      }

      // Parse the JSON response from the API.
      const data = await response.json();
      // Set the ai response, to be displayed to the user.
      setAiResponse(data.aiResponse);
      // clear the api error state.
      setApiError('');
    } catch (error) {
      // If there was an error, log it to the console.
      console.error("API Error:", error);
      // Check if the error is an http error.
      if (error.message.includes("HTTP error!")) {
        // Extract the error message from the error.message string.
        const errorMessage = error.message.split("message: ")[1];
        // Set the error message to display to the user.
        setApiError(errorMessage);
      } else {
        // set the api error to display an error to the user.
        setApiError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return { aiResponse, apiError, handleSummarizeClick };
}

export default useSummarization;