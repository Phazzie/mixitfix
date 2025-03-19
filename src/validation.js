/**
 * @module validation
 * @description This module provides input validation functions for the frontend.
 */

/**
 * Validates if the input text is not an empty string after trimming whitespace.
 * @param {string} text - The text to validate.
 * @returns {boolean} - True if the input is not an empty string (after trimming), false otherwise.
 *
 * Example Usage:
 * 
 */
const validateInput = (text) => {
  return text.trim() !== "";
};

export { validateInput };