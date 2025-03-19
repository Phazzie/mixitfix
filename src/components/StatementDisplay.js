import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * @module StatementDisplay
 * @function StatementDisplay
 * @description This module provides the StatementDisplay component, which displays the submitted statements and the AI response.
 * @description This component displays the submitted statements and the AI response.
 * @param {object} props - The component props.
 * @param {string} props.code - The code used to retrieve the statements from localStorage.
 * @param {string} props.aiResponse - The AI response to display.
 * @param {string} props.apiError - Any API error message to display.
 * @returns {JSX.Element} - The StatementDisplay component.
 */
function StatementDisplay({ code, aiResponse, apiError }) {
  // Use the useLocalStorage hook to get the statements for the current code.
  // storedStatements: the statements retrieved from local storage.
  // loading: if the data is loading from local storage.
  // error: any error that occurred while retrieving data from local storage.
  const [storedStatements, , , loading, error] = useLocalStorage(code);

  return (
    <div>
      <h2>Submitted Statements</h2>
      {/* Display API errors if present */}
      {apiError && <p className="error">{apiError}</p>}
      {/* Display the AI response if present */}
      {aiResponse && (
        <div className="ai-response"><h3>AI Response:</h3><p>{aiResponse}</p></div>
      )}
      {/* Display loading while we get the statements. */}
      {loading && <p>Loading...</p>}
      {/* Display error if there is a problem getting statements. */}
      {error && <p className='error'>Error getting statements from local storage.</p>}
      {/* Display the statements if they exist. */}
      {storedStatements && storedStatements.length > 0 && (
        <ul>
          {storedStatements.map((statement, index) => (
            <li key={index}>{`User ${statement.user}: ${statement.text}`}</li>
          ))}
        </ul>
      )}
      {/* Display no values to display if there are no stored statements, and there are no errors or loading. */}
      {!loading && !error && storedStatements && storedStatements.length === 0 && <p>No values to display</p>}

    </div>
  );
}
export default StatementDisplay;
