import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ParticipantInput component: Allows users to input and submit their statements.
function ParticipantInput({ label, buttonLabel, code }) {
  // inputText: State to store the current input text.
  const [inputText, setInputText] = useState('');
  // errorMessage: State to store and display error messages.
  const [errorMessage, setErrorMessage] = useState(''); 

  // handleChange: Updates the inputText state as the user types.
  const handleChange = (event) => {
    // Set the input text to the current value of the input
    setInputText(event.target.value);
  };

  // handleAddStatement: Adds a new statement to the localStorage for the given code.
  const handleAddStatement = (currentCode, newStatement) => {
    // Retrieve existing statements from localStorage, or initialize an empty array.
    const storedData = localStorage.getItem(currentCode);
    let dataArray = [];
    if (storedData) {
      // Parse the existing statements from JSON.
      dataArray = JSON.parse(storedData);
    }
    // Add the new statement to the array.
    dataArray.push(newStatement);
    // Store the updated array back to localStorage.
    localStorage.setItem(currentCode, JSON.stringify(dataArray));
  };

  // handleSubmit: Handles the submission of the user's statement.
  const handleSubmit = () => {
    // Check if the input text is empty after trimming whitespace.
    if (inputText.trim() === '') {
      // Set an error message if the input is empty.
      setErrorMessage('Input cannot be empty.');
      return;
    }

    try {
      // Attempt to add the new statement to localStorage.
      handleAddStatement(code, {
        // User label for the statement.
        user: label,
        // Text content of the statement.
        text: inputText,
      });
      // Clear the input field after successful submission.
      setInputText('');
    } catch (error) {
      // Handle any errors that occur during localStorage interaction.
      setErrorMessage('Error interacting with local storage.');
      console.error('Local storage error:', error);
    }
  };

  return (
    <div>
      {/* Label for the input field, dynamically generated based on the label prop. */}
      <label htmlFor={`participantInput-${label}`}>{label}</label>
      {/* Textarea for user input. */}
      <textarea
        id={`participantInput-${label}`}
        value={inputText}
        onChange={handleChange}
      />
      {/* Button to submit the user's statement. */}
      <button onClick={handleSubmit}>{buttonLabel}</button>
      {/* Error message display. Only shown if errorMessage is set. */}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </div>
  );
}

export default ParticipantInput;