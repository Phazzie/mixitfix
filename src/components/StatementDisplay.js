import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// StatementDisplay component displays the submitted statements and the AI response.
function StatementDisplay({ code, aiResponse, apiError }) {
  // State to store the statements to display.
  const [statements, setStatements] = useState(null);
  // State to store errors from local storage.
  const [localStorageError, setLocalStorageError] = useState(null);
  // useLocalStorage hook to manage statements for the current code.
  // storedStatements: The statements stored in local storage.
  // setStoredStatements: A function to set the statements in local storage.
  // getStatements: A function to get the statements from local storage.
  // loading: A boolean indicating if local storage is loading.
  // error: An error object if there was a problem loading local storage.
  const [storedStatements, setStoredStatements, getStatements, loading, error] = useLocalStorage(code);

  // useEffect hook to get the statements when the code changes or the storedStatements are updated.
  useEffect(() => {
    // only try to get statements if there is a code.
    if (code) {
      try {
        // get statements from local storage.
        getStatements();
        // set the statements state with the stored statements.
        setStatements(storedStatements);
      } catch (error) {
        // throw an error if there is a problem getting the statements.
        throw new Error("Error getting statements: " + error.message);
      }
    }
    // only run when the code or storedStatements changes.
  }, [code, storedStatements]);
  // display loading while we get the statements.
  if(loading){return <p>loading...</p>}
  // display error if there is a problem getting statements.
  if(error){ return <p className='error'>Error getting statements from local storage.</p>}
  return (
    <div>
      <h2>Submitted Statements</h2>
      {/* Display API errors if present */}
      {apiError && <p className="error">{apiError}</p>}
      {/* Display the AI response if present */}
      {aiResponse && (
        <div className="ai-response"><h3>AI Response:</h3><p>{aiResponse}</p></div>
      )}
        {/* Display the statements if they are not null */}
        {statements !== null ? (
          statements.length > 0 ? (
            <ul>
              {statements.map((statement, index) => (
                <li key={index}>{`User ${statement.user}: ${statement.text}`}</li>
              ))}
            </ul>
          ) : (
            <p>No values to display</p>
          )
        ) : null}
    </div>
  );
}
export default StatementDisplay;