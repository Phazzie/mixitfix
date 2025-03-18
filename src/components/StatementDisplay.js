import React, { useState, useEffect } from 'react';

function StatementDisplay({ code, aiResponse, apiError }) {
  const [statements, setStatements] = useState(null);
  const [localStorageError, setLocalStorageError] = useState(null);


  useEffect(() => {
    if (code) {
      try {
        const storedData = localStorage.getItem(code);
        if (storedData) {
          setStatements(JSON.parse(storedData));
        } else {
          setStatements([]);
        }
      } catch (error) {
        setLocalStorageError("Error reading from local storage.");
      }
    }
  }, [code]);

  return (
    <div>
      <h2>Submitted Statements</h2>
      {apiError && <p className="error">{apiError}</p>}
      {aiResponse && (
        <div className="ai-response"><h3>AI Response:</h3><p>{aiResponse}</p></div>
      )}
      <div>
        {localStorageError && <p className="error">{localStorageError}</p>}
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
    </div>
  );
}
export default StatementDisplay;