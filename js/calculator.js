/**
 * calculator.js — Pure Computational Module
 *
 * Core arithmetic functions and input validation for the Simple Calculator.
 * This module contains ZERO DOM dependencies — all functions are pure,
 * accepting parameters and returning deterministic results.
 *
 * Exported (global) functions:
 *   add(a, b)          — Returns a + b
 *   subtract(a, b)     — Returns a - b
 *   multiply(a, b)     — Returns a * b
 *   divide(a, b)       — Returns a / b or error string for division by zero
 *   validate(val1, val2) — Returns null on success or an error message string
 *
 * Load order: This file must be loaded FIRST (before history.js and app.js).
 */

// ---------------------------------------------------------------------------
// Arithmetic Functions
// ---------------------------------------------------------------------------

/**
 * Adds two numbers.
 *
 * @param {number} a - The first operand.
 * @param {number} b - The second operand.
 * @returns {number} The sum of a and b.
 */
function add(a, b) {
    return a + b;
}

/**
 * Subtracts the second number from the first.
 *
 * @param {number} a - The first operand.
 * @param {number} b - The second operand.
 * @returns {number} The difference a - b.
 */
function subtract(a, b) {
    return a - b;
}

/**
 * Multiplies two numbers.
 *
 * @param {number} a - The first operand.
 * @param {number} b - The second operand.
 * @returns {number} The product of a and b.
 */
function multiply(a, b) {
    return a * b;
}

/**
 * Divides the first number by the second.
 * Returns the exact error string "Cannot divide by zero" when the divisor is zero.
 *
 * @param {number} a - The dividend.
 * @param {number} b - The divisor.
 * @returns {number|string} The quotient a / b, or the error string when b === 0.
 */
function divide(a, b) {
    if (b === 0) {
        return "Cannot divide by zero";
    }
    return a / b;
}

// ---------------------------------------------------------------------------
// Input Validation
// ---------------------------------------------------------------------------

/**
 * Validates two raw string values from input fields before arithmetic.
 *
 * Validation priority order (per specification):
 *   1. Empty field check — runs FIRST to prevent isNaN("") edge cases
 *   2. Non-numeric check — runs SECOND using Number() for strict parsing
 *
 * @param {string} val1 - Raw string value from the first input field.
 * @param {string} val2 - Raw string value from the second input field.
 * @returns {null|string} null when both values are valid numbers,
 *   or the exact error message string on failure:
 *   - "Please enter both numbers" when either input is empty after trimming
 *   - "Invalid input, please enter numbers only" when either input is non-numeric
 */
function validate(val1, val2) {
    // Step 1: Trim whitespace and check for empty inputs FIRST.
    // This must precede the numeric check so that empty strings
    // produce the correct "Please enter both numbers" message
    // instead of the non-numeric message.
    var trimmed1 = val1.trim();
    var trimmed2 = val2.trim();

    if (trimmed1 === '' || trimmed2 === '') {
        return "Please enter both numbers";
    }

    // Step 2: Check for non-numeric inputs SECOND.
    // Number() is used instead of parseFloat() because parseFloat("12abc")
    // returns 12 (partial parse), while Number("12abc") correctly returns NaN.
    // This ensures strings like "12abc" are properly rejected.
    if (isNaN(Number(trimmed1)) || isNaN(Number(trimmed2))) {
        return "Invalid input, please enter numbers only";
    }

    // Both inputs are valid numbers — validation passed.
    return null;
}
