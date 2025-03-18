import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';
import RandomCodeButton from './components/RandomCodeButton';
import CodeDisplay from './components/CodeDisplay';
import ParticipantInput from './components/ParticipantInput';
import StatementDisplay from './components/StatementDisplay';

function App() {
  // State variable to determine if the AI summarization button should be enabled.
  const [canSummarize, setCanSummarize] = useState(false);
  // State variable to store the AI's response.
  const [aiResponse, setAiResponse] = useState('');
  // State variable for storing error messages from the API.
  const [apiError] = useState('');
  // Custom hook to manage the generated code in local storage.
  // The code is used to group the discussions.
  const [code, setCode] = useLocalStorage('generatedCode', '');

  /**
   * Retrieves the most recent statement for a given user from local storage.
   * @param {string} currentCode - The current discussion code.
   * @param {string} user - The user for whom to retrieve the statement.
   * @returns {string|null} - The most recent statement or null if no statement is found.
   */
  const getMostRecentStatement = (currentCode, user) => {
    // Retrieve the data from local storage using the current code as the key.
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

  // useEffect hook to update canSummarize whenever the code changes.
  // This checks if both users have submitted a statement and enables the summarize button.
  useEffect(() => {
    const user1Statement = getMostRecentStatement(code, "Participant 1");
    const user2Statement = getMostRecentStatement(code, "Participant 2");
    setCanSummarize(!!user1Statement && !!user2Statement);
  }, [code]);

  const handleSummarizeClick = async () => {
    // Reset the AI response state before fetching a new summary.
    setAiResponse('');
    // Get the most recent statements for both participants.
    const user1Statement = getMostRecentStatement(code, "Participant 1");
    const user2Statement = getMostRecentStatement(code, "Participant 2");
    // If either statement is missing, set an error message and return.
    if (!user1Statement || !user2Statement) {
      // Both statements are required to summarize
      // the apiError state variable is not used because there is not a place to display the error.
      return;
    }
    // Attempt to fetch a summary from the AI.
    try {
      // Make a POST request to the /api/ai-summarize endpoint.
      const response = await fetch('/api/ai-summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the user statements in the request body.
        body: JSON.stringify({ user1Statement, user2Statement }),
      });
      // Check if the response is okay.
      // If not, throw an error.
      // this will stop the rest of the try block from running and go to the catch.
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAiResponse(data.aiResponse);
    } catch (error) {
      // api error is not displayed because there is not a place to display it in the UI.
      // this catch will log an error to the console, but it does not do anything else.
    }
  };

  return (
    <div className="App">
      {/* the random code is generated on the client because of time constrains. */}
      <h1>Relationship Resolver</h1>
      <RandomCodeButton setCode={setCode} code={code} />
      <CodeDisplay code={code} />
      <StatementDisplay code={code} aiResponse={aiResponse} apiError={apiError} />
      <ParticipantInput
        code={code}
        user="Participant 1"
        buttonText="Submit Participant 1"
      />
      <ParticipantInput
        code={code}
        label="Participant 2"
        buttonText="Submit Participant 2"
      />
      <button disabled={!canSummarize} onClick={handleSummarizeClick}>
        Summarize with AI
      </button>

    </div>
  );
}
export default App;
