import React, { useState, useEffect } from 'react';
import './App.css';
import RandomCodeButton from './components/RandomCodeButton';
import CodeDisplay from './components/CodeDisplay';
import ParticipantInput from './components/ParticipantInput';
import StatementDisplay from './components/StatementDisplay';


function App() {
  const [canSummarize, setCanSummarize] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [apiError, setApiError] = useState('');
  const [code, setCode] = useState(() => {
    const storedCode = localStorage.getItem('generatedCode');
    return storedCode || '';
  });

  const getMostRecentStatement = (user) => {
    const data = localStorage.getItem(code);
    if (!data) return null;

    const parsedData = JSON.parse(data);
    const userStatements = parsedData.filter((item) => item.user === user);
    if (userStatements.length === 0) return null;

    return userStatements[userStatements.length - 1].text;
  };

  useEffect(() => {
    localStorage.setItem('generatedCode', code);
  }, [code]);

  useEffect(() => {
    const user1Statement = getMostRecentStatement("Participant 1");
    const user2Statement = getMostRecentStatement("Participant 2");
    setCanSummarize(!!user1Statement && !!user2Statement);
  }, [code]);

  const handleSummarizeClick = async () => {
    setApiError('');
    setAiResponse('');

    const user1Statement = getMostRecentStatement("Participant 1");
    const user2Statement = getMostRecentStatement("Participant 2");

    if (!user1Statement || !user2Statement) {
      setApiError("Both participants must submit a statement.");
      return;
    }
    try {
      const response = await fetch('/api/ai-summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user1Statement, user2Statement }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAiResponse(data.aiResponse);
    } catch (error) {
      setApiError("Failed to get summary from AI.");
    }
  };

  return (
    <div className="App">
      <h1>Relationship Resolver</h1>
      <RandomCodeButton setCode={setCode} code={code} />
      <CodeDisplay code={code}/>
      <StatementDisplay code={code} aiResponse={aiResponse} apiError={apiError}/>
      <ParticipantInput
        code={code}
        label="Participant 1"
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
