import React, { useState, useEffect } from 'react';

function RandomCodeButton({ setCode }) {
  const [localCode, setLocalCode] = useState('');

  // Function to generate a random 6-character alphanumeric code
  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCode(result);
    setLocalCode(result);
  };

  // Load code from localStorage on component mount
  useEffect(() => {
    const storedCode = localStorage.getItem('randomCode');
    if (storedCode) {
      setLocalCode(storedCode);
      setCode(storedCode);
    } else {
      setLocalCode('');
      setCode("");
    }
  }, [setCode]);

  // Save code to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('randomCode', localCode);
  }, [localCode]);

  return (
    <div>
        <button onClick={generateRandomCode}>Generate Random Code</button>
    </div>

  );
}



export { RandomCodeButton };