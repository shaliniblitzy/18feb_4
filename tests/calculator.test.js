/**
 * calculator.test.js — Comprehensive Unit Tests for calculator.js
 *
 * Tests all five global functions exported by js/calculator.js:
 *   add(a, b), subtract(a, b), multiply(a, b), divide(a, b), validate(val1, val2)
 *
 * This file is loaded via <script> tag in tests/calculator.test.html AFTER
 * js/calculator.js. All calculator functions and assertion helpers (assert,
 * assertEqual, assertStrictEqual, describe, test) are available globally.
 *
 * Error message constants (verbatim, from specification):
 *   - Division by zero:  "Cannot divide by zero"
 *   - Empty inputs:      "Please enter both numbers"
 *   - Non-numeric inputs: "Invalid input, please enter numbers only"
 *
 * Browser compatibility: ES5 syntax only (var, function declarations).
 * Compatible with Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+.
 */

// ==========================================================================
// Test Group 1: add() Function
// ==========================================================================

describe('add() function', function () {

    // Happy path — user example scenario from specification
    assertStrictEqual(
        add(25, 10),
        35,
        'add(25, 10) should return 35 (user example)'
    );

    // Zero + zero
    assertStrictEqual(
        add(0, 0),
        0,
        'add(0, 0) should return 0'
    );

    // Negative number + positive number
    assertStrictEqual(
        add(-5, 3),
        -2,
        'add(-5, 3) should return -2'
    );

    // Two negative numbers
    assertStrictEqual(
        add(-5, -3),
        -8,
        'add(-5, -3) should return -8'
    );

    // Decimal numbers producing an integer result
    assertStrictEqual(
        add(2.5, 3.5),
        6,
        'add(2.5, 3.5) should return 6'
    );

    // Floating point precision (IEEE 754 awareness)
    // 0.1 + 0.2 is approximately 0.30000000000000004 in IEEE 754
    assert(
        Math.abs(add(0.1, 0.2) - 0.3) < 1e-10,
        'add(0.1, 0.2) should be approximately 0.3 (IEEE 754 tolerance)'
    );

    // Large numbers
    assertStrictEqual(
        add(999999, 1),
        1000000,
        'add(999999, 1) should return 1000000'
    );

});

// ==========================================================================
// Test Group 2: subtract() Function
// ==========================================================================

describe('subtract() function', function () {

    // Happy path — inverse of user example
    assertStrictEqual(
        subtract(25, 10),
        15,
        'subtract(25, 10) should return 15'
    );

    // Result is negative
    assertStrictEqual(
        subtract(10, 25),
        -15,
        'subtract(10, 25) should return -15'
    );

    // Zero minus zero
    assertStrictEqual(
        subtract(0, 0),
        0,
        'subtract(0, 0) should return 0'
    );

    // Two negatives: -5 - (-3) = -5 + 3 = -2
    assertStrictEqual(
        subtract(-5, -3),
        -2,
        'subtract(-5, -3) should return -2'
    );

    // Decimal subtraction (IEEE 754 awareness)
    // 5.5 - 2.3 ≈ 3.2 (may have floating-point imprecision)
    assert(
        Math.abs(subtract(5.5, 2.3) - 3.2) < 1e-10,
        'subtract(5.5, 2.3) should be approximately 3.2 (IEEE 754 tolerance)'
    );

    // Large numbers
    assertStrictEqual(
        subtract(1000000, 1),
        999999,
        'subtract(1000000, 1) should return 999999'
    );

});

// ==========================================================================
// Test Group 3: multiply() Function
// ==========================================================================

describe('multiply() function', function () {

    // Happy path — user example
    assertStrictEqual(
        multiply(25, 10),
        250,
        'multiply(25, 10) should return 250'
    );

    // Multiply by zero
    assertStrictEqual(
        multiply(0, 100),
        0,
        'multiply(0, 100) should return 0'
    );

    // Negative times positive
    assertStrictEqual(
        multiply(-5, 3),
        -15,
        'multiply(-5, 3) should return -15'
    );

    // Two negatives produce a positive
    assertStrictEqual(
        multiply(-5, -3),
        15,
        'multiply(-5, -3) should return 15'
    );

    // Decimal multiplication producing a clean result
    assertStrictEqual(
        multiply(2.5, 4),
        10,
        'multiply(2.5, 4) should return 10'
    );

    // Large numbers
    assertStrictEqual(
        multiply(1000, 1000),
        1000000,
        'multiply(1000, 1000) should return 1000000'
    );

});

// ==========================================================================
// Test Group 4: divide() Function
// ==========================================================================

describe('divide() function', function () {

    // Basic division with decimal result
    assertStrictEqual(
        divide(25, 10),
        2.5,
        'divide(25, 10) should return 2.5'
    );

    // Even division producing an integer
    assertStrictEqual(
        divide(10, 2),
        5,
        'divide(10, 2) should return 5'
    );

    // Zero divided by non-zero
    assertStrictEqual(
        divide(0, 5),
        0,
        'divide(0, 5) should return 0'
    );

    // Negative dividend
    assertStrictEqual(
        divide(-10, 2),
        -5,
        'divide(-10, 2) should return -5'
    );

    // Negative divisor
    assertStrictEqual(
        divide(10, -2),
        -5,
        'divide(10, -2) should return -5'
    );

    // Two negatives produce a positive quotient
    assertStrictEqual(
        divide(-10, -2),
        5,
        'divide(-10, -2) should return 5'
    );

    // Non-terminating decimal (7 / 3 ≈ 2.3333...)
    assert(
        Math.abs(divide(7, 3) - 7 / 3) < 1e-10,
        'divide(7, 3) should return approximately 2.3333...'
    );

    // CRITICAL: Division by zero must return the exact error string
    assertStrictEqual(
        divide(10, 0),
        'Cannot divide by zero',
        'divide(10, 0) should return "Cannot divide by zero"'
    );

    // CRITICAL: Zero divided by zero is also division by zero
    assertStrictEqual(
        divide(0, 0),
        'Cannot divide by zero',
        'divide(0, 0) should return "Cannot divide by zero"'
    );

    // Verify the return type is a string, NOT a number
    assertStrictEqual(
        typeof divide(10, 0),
        'string',
        'divide(10, 0) should return a string type'
    );

    // Verify regular division returns a number type
    assertStrictEqual(
        typeof divide(10, 2),
        'number',
        'divide(10, 2) should return a number type'
    );

});

// ==========================================================================
// Test Group 5: validate() Function
// ==========================================================================

describe('validate() function — empty input tests', function () {

    // First input empty, second valid
    assertStrictEqual(
        validate('', '5'),
        'Please enter both numbers',
        'validate("", "5") should return "Please enter both numbers"'
    );

    // Second input empty, first valid
    assertStrictEqual(
        validate('5', ''),
        'Please enter both numbers',
        'validate("5", "") should return "Please enter both numbers"'
    );

    // Both inputs empty
    assertStrictEqual(
        validate('', ''),
        'Please enter both numbers',
        'validate("", "") should return "Please enter both numbers"'
    );

    // Whitespace-only first input (treated as empty after trim)
    assertStrictEqual(
        validate('  ', '5'),
        'Please enter both numbers',
        'validate("  ", "5") should return "Please enter both numbers"'
    );

    // Whitespace-only second input (treated as empty after trim)
    assertStrictEqual(
        validate('5', '   '),
        'Please enter both numbers',
        'validate("5", "   ") should return "Please enter both numbers"'
    );

});

describe('validate() function — non-numeric input tests', function () {

    // Text in first input
    assertStrictEqual(
        validate('abc', '5'),
        'Invalid input, please enter numbers only',
        'validate("abc", "5") should return "Invalid input, please enter numbers only"'
    );

    // Text in second input
    assertStrictEqual(
        validate('5', 'xyz'),
        'Invalid input, please enter numbers only',
        'validate("5", "xyz") should return "Invalid input, please enter numbers only"'
    );

    // Both inputs non-numeric
    assertStrictEqual(
        validate('abc', 'xyz'),
        'Invalid input, please enter numbers only',
        'validate("abc", "xyz") should return "Invalid input, please enter numbers only"'
    );

    // Partial numeric string edge case: "12abc" should be rejected
    // Number("12abc") returns NaN, so this must be caught
    assertStrictEqual(
        validate('12abc', '5'),
        'Invalid input, please enter numbers only',
        'validate("12abc", "5") should return "Invalid input, please enter numbers only"'
    );

});

describe('validate() function — valid input tests', function () {

    // Basic valid integers
    assertStrictEqual(
        validate('25', '10'),
        null,
        'validate("25", "10") should return null'
    );

    // Negative and decimal are valid
    assertStrictEqual(
        validate('-5', '3.14'),
        null,
        'validate("-5", "3.14") should return null'
    );

    // Zeros are valid numbers
    assertStrictEqual(
        validate('0', '0'),
        null,
        'validate("0", "0") should return null'
    );

    // Numbers with surrounding whitespace should be valid after trim
    assertStrictEqual(
        validate(' 25 ', ' 10 '),
        null,
        'validate(" 25 ", " 10 ") should return null (whitespace trimmed)'
    );

    // Decimal input
    assertStrictEqual(
        validate('0.5', '100'),
        null,
        'validate("0.5", "100") should return null'
    );

});

describe('validate() function — priority order and exact message verification', function () {

    // CRITICAL: Empty check must run BEFORE non-numeric check.
    // validate("", "abc") should return the empty-input message,
    // NOT the non-numeric message.
    assertStrictEqual(
        validate('', 'abc'),
        'Please enter both numbers',
        'validate("", "abc") should return "Please enter both numbers" (empty check priority)'
    );

    // Verify the exact empty-input error string (case-sensitive, no extra characters)
    assertStrictEqual(
        validate('', '5'),
        'Please enter both numbers',
        'Empty error message must be exactly "Please enter both numbers"'
    );

    // Verify the exact non-numeric error string (case-sensitive, no extra characters)
    assertStrictEqual(
        validate('abc', '5'),
        'Invalid input, please enter numbers only',
        'Non-numeric error message must be exactly "Invalid input, please enter numbers only"'
    );

    // Verify valid inputs return exactly null (not undefined, not "", not false)
    assertStrictEqual(
        validate('10', '20'),
        null,
        'Valid inputs must return exactly null (strict equality)'
    );

    // Verify the return type for null is "object" (typeof null === "object" in JS)
    assertStrictEqual(
        typeof validate('10', '20'),
        'object',
        'typeof validate("10", "20") should be "object" (since null is of type object)'
    );

    // Verify error returns are of type "string"
    assertStrictEqual(
        typeof validate('', '5'),
        'string',
        'typeof validate("", "5") should be "string"'
    );

    assertStrictEqual(
        typeof validate('abc', '5'),
        'string',
        'typeof validate("abc", "5") should be "string"'
    );

});
