import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Import useLocalStorage to use local storage.

/**
 * @module RandomCodeButton
 * RandomCodeButton Component
 * @description This component is responsible for generating a random code and storing it in local storage.
 */

/**
 * @function RandomCodeButton
 */
function RandomCodeButton({ setCode }) {

  /**
   * generateRandomCode
   * Generates a random 6-character alphanumeric code.
   * Updates the code state with the new code.
   */
  // define the function to generate the random code.
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
  // codeFromLocalStorage: the code that was retrieved from local storage.
  // setCodeToLocalStorage: the function that will save the code to local storage.
  const [codeFromLocalStorage, setCodeToLocalStorage] = useLocalStorage('randomCode', '');
  // set the code from local storage to the code state.
  // this will make sure that if there is a code saved in local storage, it will be displayed.
  setCode(codeFromLocalStorage);

  return (
    // return the button that will generate the random code.
    <div>
        {/* Button to trigger the generation of a new random code. */}
        <button onClick={generateRandomCode}>Generate Random Code</button>
    </div>
  );
}
export default RandomCodeButton;