import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { validateInput } from '../validation';

/**
 * @module ParticipantInput
 * @description This module provides the ParticipantInput component, which allows users to input and submit their statements.
 * It handles input validation, local storage interactions, and error messages.
 */

/**
 * @function ParticipantInput
 * @description ParticipantInput component: Allows users to input and submit their statements.
 * @param {object} props - The component props.
 * @param {string} props.label - The label for the input field.
 * @param {string} props.buttonLabel - The label for the submit button.
 * @param {string} props.code - The code associated with the current discussion.
 * @returns {JSX.Element} The ParticipantInput component.
 */
// ParticipantInput component: Allows users to input and submit their statements.
function ParticipantInput({ label, buttonLabel, code }) {
  // inputText: State to store the current input text in the textarea.
  const [inputText, setInputText] = useState('');
  // errorMessage: State to store and display error messages. This is displayed below the textarea.
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * @function handleChange
   * @description Updates the inputText state as the user types.
   * @param {object} event - The change event.
   */
  const handleChange = (event) => {
    // Set the input text to the current value of the input
    setInputText(event.target.value);
  };

  /**
   * @function handleAddStatement
   * @description Adds a new statement to the localStorage for the given code.
   * @param {string} currentCode - The current code associated with the discussion.
   * @param {object} newStatement - The new statement to add.
   */
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

  /**
   * @function handleSubmit
   * @description Handles the submission of the user's statement.
   * Validates the input, attempts to add the statement to local storage, and handles error messages.
   */
  const handleSubmit = () => {
    // Check if the input text is valid using the validateInput function.
    if (!validateInput(inputText)) {
      // Set an error message if the input is invalid.
      setErrorMessage('Please enter a statement before submitting.');
      return;
    }

    try {
      // Attempt to add the new statement to localStorage.
      handleAddStatement(code, {
        // User label for the statement.
        user: label,
        // This stores the label of the user, so we know which user added the statement.
        // eg Participant 1 or Participant 2.
        
        // Text content of the statement.
        text: inputText,
      });
      // Clear the input field after successful submission.
      setInputText('');
    } catch (error) {
      // Handle any errors that occur during localStorage interaction.
      setErrorMessage('Error interacting with local storage: ' + error.message);
      console.error('Local storage error:', error);
      // Clear the input field if there's an error.
      setInputText('');
    } finally {
      // Clear the error message after 5 seconds, this occurs no matter if there was an error or not.
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
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