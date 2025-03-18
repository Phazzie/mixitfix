import React, { useState } from 'react';

function ParticipantInput({ label, buttonLabel, code }) {
  const [inputText, setInputText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = () => {
    if (inputText.trim() === '') {
      setErrorMessage('Input cannot be empty.');
      return;
    }

    setErrorMessage(''); // Clear any previous error messages

    try {
      const storedData = localStorage.getItem(code);
      let dataArray = [];

      if (storedData) {
        dataArray = JSON.parse(storedData);
      }

      const newData = {
        user: label,
        text: inputText
      };
      dataArray.push(newData);

      localStorage.setItem(code, JSON.stringify(dataArray));
      setInputText(''); // Clear input after successful submission
    } catch (error) {
      setErrorMessage('Error interacting with local storage.');
      console.error('Local storage error:', error);
    }
  };

  return (
    <div>
      <label htmlFor={`participantInput-${label}`}>{label}</label>
      <textarea
        id={`participantInput-${label}`}
        value={inputText}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>{buttonLabel}</button>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </div>
  );
}

export default ParticipantInput;