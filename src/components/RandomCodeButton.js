import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * RandomCodeButton Component
 * This component is responsible for generating a random code and storing it in local storage.
 */
function RandomCodeButton({ setCode }) {

  /**
   * generateRandomCode
   * Generates a random 6-character alphanumeric code.
   * Updates the code state with the new code.
   */
  const generateRandomCode = () => {
    // Define the set of characters to choose from.
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    // Iterate 6 times to generate a 6-character code.
    for (let i = 0; i < 6; i++) {
      // Append a random character from the character set to the result.
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    // Update the code state with the generated code.
    setCode(result);
    // Update the code in local storage.
    setCodeToLocalStorage(result)
  };
  
  // Use the useLocalStorage hook to manage the code in local storage.
  // This custom hook allows us to easily get and set the code in local storage.
  const [codeFromLocalStorage, setCodeToLocalStorage] = useLocalStorage('randomCode', '');
  // set the code from local storage to the code state.
  setCode(codeFromLocalStorage);

  return (
    <div>
        {/* Button to trigger the generation of a new random code. */}
        <button onClick={generateRandomCode}>Generate Random Code</button>
    </div>
  );
}
export { RandomCodeButton };