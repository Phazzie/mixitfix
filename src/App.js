import React from 'react';
import './App.css';
import RandomCodeButton from './components/RandomCodeButton';
import CodeDisplay from './components/CodeDisplay';
import ParticipantInput from './components/ParticipantInput';
import StatementDisplay from './components/StatementDisplay';
import useStatements from './hooks/useStatements';
import useSummarization from './hooks/useSummarization';

/**
 * @module App
 * @description This is the main module for the client application.
 * It defines the App component, which manages the state and renders the user interface.
 * This component handles user input, interactions with local storage, and communication with the backend API.
 */
function App() {
  // useStatements hook to manage statements and code.
  const { code, setCode, canSummarize, getMostRecentStatement } = useStatements();
  // useSummarization hook to manage summarization.
  const { aiResponse, apiError, handleSummarizeClick } = useSummarization(getMostRecentStatement);
  return (
    <div className="App">
      {/* Title */}
      <h1>Relationship Resolver</h1>
      {/* Generate a random code */}
      <RandomCodeButton setCode={setCode} code={code} />
      {/* Display the current code */}
      <CodeDisplay code={code} />
      {/* Display the AI response */}
      <StatementDisplay code={code} aiResponse={aiResponse} apiError={apiError} />
      {/* Display API error message if it exists */}
      {apiError && <div style={{ color: 'red' }}>{apiError}</div>}
      {/* Participant 1 Input */}
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
      {/* Summarize button */}
      <button disabled={!canSummarize} onClick={() => handleSummarizeClick(code)}>
        Summarize with AI
      </button>
    </div>
  );
}

export default App;
