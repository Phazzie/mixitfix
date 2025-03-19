import React, { useState, useEffect } from 'react';
import './App.css';
import RandomCodeButton from './components/RandomCodeButton';
import CodeDisplay from './components/CodeDisplay';
import ParticipantInput from './components/ParticipantInput';
import StatementDisplay from './components/StatementDisplay';
import useStatements from './hooks/useStatements';
import useSummarizeStatements from './hooks/useSummarizeStatements';
import useStatementLoader from './hooks/useStatementLoader';

/**
 * @module App
 * @description Main module for the client application.
 * It defines the App component, which manages the state and renders the user interface.
 * This component handles user input, interactions with local storage, and communication with the backend API.
 */

function App() {
  // State to track if summarization is in progress.
  const [isSummarizing, setIsSummarizing] = useState(false);
  // State to store the entered code.
  const [enteredCode, setEnteredCode] = useState('');

  /**
   * useStatements hook to manage statements and code.
   * @typedef {Object} StatementsHook
   * @property {string} code - The current code.
   * @property {function} setCode - Function to set the current code.
   * @property {boolean} canSummarize - Indicates if summarization can be performed.
   * @property {function} getMostRecentStatement - Function to get the most recent statement for a given user.
   * @property {function} getStatements - Function to load the statements.
   */
  const { code, setCode, canSummarize } = useStatements();
  /**
   * useSummarizeStatements hook to manage summarization.
   * @typedef {Object} SummarizationHook
   * @property {string} aiResponse - The AI response.
   * @property {string} apiError - The API error.
   * @property {function} handleSummarize - Function to summarize the statements.
   * @property {function} handleSummarizeClick - Function to handle the click on the summarize button.
    * @property {function} handleError - Function to handle errors.
   */
  const { aiResponse, apiError, handleSummarizeClick, handleError } = useSummarizeStatements();

  const { statements, error, loading } = useStatementLoader(code, handleError);

  // Check if there is an error.
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }
  return (
      /**
     * @namespace App
     * @description This is the main container for the application.
     */
    <div className="App">
      {/* Title */}
          <h1>Relationship Resolver</h1>
        {/* Display local error message if it exists. */}
      {localError && <div style={{ color: 'red' }}>{localError}</div>}
      {/* Enter a code to load a session */}
      <input type="text" value={enteredCode} onChange={(e) => setEnteredCode(e.target.value)} placeholder="Enter code" />
      <button onClick={() => setCode(enteredCode)}>Use code</button>

      {/* Generate a random code. */}
      <RandomCodeButton setCode={setCode} code={code} />
      {/* Display the current code. */}
      <CodeDisplay code={code} getStatements={getStatements}/>

      {/* Display the AI response. */}
      <StatementDisplay code={code} aiResponse={aiResponse} apiError={apiError} />
      {/* Display API error message if it exists. */}
      {apiError && <div style={{ color: 'red' }}>{apiError}</div>}

        {/* Participant 1 Input. */}
        /**
         * @namespace ParticipantInput
         * @description This is the input for the first participant.
         */
        <ParticipantInput
            code={code}
            user="Participant 1"
            buttonText="Submit Participant 1"
        />
        {/* Participant 2 Input. */}
        <ParticipantInput
            code={code}
            label="Participant 2"
            buttonText="Submit Participant 2"
        />
        {/* Summarize button. */}
        /**
       * @namespace SummarizeButton
       * @description This is the button that triggers the summarization.
       */
      <button
          disabled={!canSummarize || isSummarizing}
          onClick={handleSummarizeClick}
          >
          Summarize with AI
        </button>
    </div>
  );
}

export default App;
