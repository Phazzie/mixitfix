import { useState } from 'react';

/**
 * @module useSummarizeStatements
 * @description This module provides the `useSummarizeStatements` hook, which handles sending statements to the server for summarization
 * and managing the state of the request, including the response data and any errors.
 */

/**
 * @function useSummarizeStatements
 * @description React hook for summarizing statements by sending them to the server.
 * @returns {Object} An object containing the response data, an error message, and functions to trigger the summarization and set an error.
 * @property {string} aiResponse - The AI's response to the summarized statements.
 * @property {string|null} apiError - An error message if the request fails, null otherwise.
 * @property {function} handleSummarize - A function to trigger the summarization process.
 * @property {function} setApiError - A function to set the apiError state.
 */
function useSummarizeStatements() {
  // State to store the AI's response to the summarized statements.
  const [aiResponse, setAiResponse] = useState(null);
  // State to store an error message if the API request fails.
  const [apiError, setApiError] = useState(null);

  /**
   * @function handleSummarize
   * @description Sends the user's statements to the server for summarization.
   * @param {string} user1Statement - The first user's statement.
   * @param {string} user2Statement - The second user's statement.
   * @async
   * @throws Will throw an error if the request fails.
   */
  const handleSummarize = async (user1Statement, user2Statement) => {
    // Clear the previous AI response and error message.
    setAiResponse(null);
    setApiError(null);

    try {
      // Send a POST request to the server with the statements in the request body.
      const response = await fetch('/api/ai-summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user1Statement, user2Statement }),
      });

      // If the response is not ok, handle the error.
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.errorMessage || 'Failed to summarize statements');
      }

      // Parse the response body as JSON.
      const data = await response.json();
      // Update the aiResponse state with the response from the server.
      setAiResponse(data.aiResponse);
    } catch (error) {
      // Set the apiError state with the error message.
      setApiError(error.message);
    }
  };

  // Return the response data, the error message, and the function to perform the request.
  return { aiResponse, apiError, handleSummarize, setApiError };
}

export default useSummarizeStatements;