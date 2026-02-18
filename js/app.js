/**
 * app.js — Application Controller (Integration Layer)
 *
 * This is the integration layer that wires all UI interactions to the
 * computation module (calculator.js) and history module (history.js).
 *
 * Loaded LAST via <script> tag in index.html (after calculator.js and history.js).
 * All functions from those modules are available in the global scope.
 *
 * This is the ONLY file that directly manipulates the DOM for user interactions.
 *
 * Dependencies (global scope):
 *   From calculator.js: add(), subtract(), multiply(), divide(), validate()
 *   From history.js:    addEntry(), clearHistory(), renderHistory()
 *   From index.html:    DOM elements #input1, #input2, #result, #clear-btn,
 *                        #theme-toggle, #history-list, [data-op] buttons
 *
 * Browser compatibility: Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+
 */

// ---------------------------------------------------------------------------
// DOM Element Selection
// ---------------------------------------------------------------------------

/** @type {HTMLInputElement} First number input field */
var input1 = document.querySelector('#input1');

/** @type {HTMLInputElement} Second number input field */
var input2 = document.querySelector('#input2');

/** @type {HTMLDivElement} Result display area */
var resultDisplay = document.querySelector('#result');

/** @type {HTMLButtonElement} Clear/reset button */
var clearBtn = document.querySelector('#clear-btn');

/** @type {HTMLButtonElement} Dark/light mode toggle button */
var themeToggle = document.querySelector('#theme-toggle');

/** @type {HTMLUListElement} History list container */
var historyList = document.querySelector('#history-list');

/** @type {NodeListOf<HTMLButtonElement>} All four operation buttons */
var operationBtns = document.querySelectorAll('[data-op]');

// ---------------------------------------------------------------------------
// Application State
// ---------------------------------------------------------------------------

/**
 * Tracks the last operation performed (e.g., "add", "subtract", "multiply",
 * "divide"). Used by the Enter key handler to re-execute the most recent
 * operation. Initialized to null — no last operation on first load.
 * Reset to null when the user clicks Clear or presses Escape.
 * @type {string|null}
 */
var lastOperation = null;

// ---------------------------------------------------------------------------
// Operation Lookup Tables
// ---------------------------------------------------------------------------

/**
 * Maps internal operation names to their display symbols for history entries.
 * Used when constructing the expression string (e.g., "25 + 10").
 * @type {Object<string, string>}
 */
var operationSymbols = {
    'add': '+',
    'subtract': '-',
    'multiply': '*',
    'divide': '/'
};

/**
 * Maps internal operation names to their corresponding calculator.js functions.
 * These functions are available in the global scope because calculator.js is
 * loaded before app.js via script tag order in index.html.
 * @type {Object<string, function(number, number): (number|string)>}
 */
var operationFunctions = {
    'add': add,
    'subtract': subtract,
    'multiply': multiply,
    'divide': divide
};

/**
 * Maps keyboard keys to internal operation names for shortcut handling.
 * @type {Object<string, string>}
 */
var keyToOperation = {
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide'
};

// ---------------------------------------------------------------------------
// Core Operation Execution
// ---------------------------------------------------------------------------

/**
 * Performs a calculation based on the given operation name.
 *
 * Complete flow:
 *   1. Read input values from DOM
 *   2. Validate inputs via calculator.js validate()
 *   3. Convert to numbers and invoke the operation function
 *   4. Display result (or error message) in the result area
 *   5. Log successful calculations to history
 *   6. Update the lastOperation tracker
 *
 * Per AAP Section 0.7.2 (Continuous Usage Rule):
 *   - Input fields are NOT cleared after displaying a result
 *   - Only the explicit Clear button (or Escape key) resets fields
 *
 * @param {string} opName - Operation identifier: "add", "subtract",
 *                          "multiply", or "divide"
 */
function performOperation(opName) {
    // Step 1: Read raw string values from the input fields
    var val1 = input1.value;
    var val2 = input2.value;

    // Step 2: Validate inputs using calculator.js validate()
    // Returns null on success, or one of these exact error strings on failure:
    //   "Please enter both numbers"
    //   "Invalid input, please enter numbers only"
    var validationError = validate(val1, val2);
    if (validationError !== null) {
        resultDisplay.textContent = validationError;
        return;
    }

    // Step 3: Convert validated strings to numbers using parseFloat
    var num1 = parseFloat(val1);
    var num2 = parseFloat(val2);

    // Step 4: Look up and invoke the corresponding arithmetic function
    var operationFn = operationFunctions[opName];
    if (!operationFn) {
        // Defensive guard — should never happen with valid button data-op values
        resultDisplay.textContent = 'Unknown operation';
        return;
    }
    var result = operationFn(num1, num2);

    // Step 5: Check if the result is an error string (from divide by zero)
    // The divide() function returns "Cannot divide by zero" when divisor is 0
    if (typeof result === 'string') {
        resultDisplay.textContent = result;
        return;
    }

    // Step 6: Display the numeric result in the result area
    resultDisplay.textContent = result;

    // Step 7: Log successful calculation to history
    // Build expression string like "25 + 10" using trimmed input values
    var symbol = operationSymbols[opName];
    var expression = val1.trim() + ' ' + symbol + ' ' + val2.trim();
    addEntry(expression, result);
    renderHistory(historyList);

    // Step 8: Track this as the last operation (for Enter key re-execution)
    lastOperation = opName;
}

/**
 * Clears all calculator state: input fields, result display, calculation
 * history, and the last operation tracker.
 *
 * Called by both the Clear button click handler and the Escape key handler
 * to avoid code duplication.
 */
function clearAll() {
    // Reset both input fields to empty strings
    input1.value = '';
    input2.value = '';

    // Clear the result display area
    resultDisplay.textContent = '';

    // Clear the history data store and re-render the empty list
    clearHistory();
    renderHistory(historyList);

    // Reset the last operation tracker so Enter key does nothing until
    // a new operation is performed
    lastOperation = null;
}

// ---------------------------------------------------------------------------
// Operation Button Click Handlers
// ---------------------------------------------------------------------------

/**
 * Attaches click event listeners to all four operation buttons.
 * Each button's data-op attribute identifies the operation to perform:
 *   data-op="add"       → addition via add()
 *   data-op="subtract"  → subtraction via subtract()
 *   data-op="multiply"  → multiplication via multiply()
 *   data-op="divide"    → division via divide()
 */
operationBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
        var opName = btn.getAttribute('data-op');
        performOperation(opName);
    });
});

// ---------------------------------------------------------------------------
// Clear Button Handler
// ---------------------------------------------------------------------------

/**
 * Handles the Clear button click.
 * Delegates to clearAll() which resets inputs, result, history, and state.
 */
clearBtn.addEventListener('click', function () {
    clearAll();
});

// ---------------------------------------------------------------------------
// Theme Toggle Handler
// ---------------------------------------------------------------------------

/**
 * Handles the theme toggle button click.
 *
 * Switches between light mode (default) and dark mode by toggling the
 * data-theme attribute on the <html> element (document.documentElement):
 *   - Light mode: no data-theme attribute (or attribute removed)
 *   - Dark mode:  data-theme="dark"
 *
 * Updates the button icon to reflect the actionable state:
 *   - "🌙" displayed when light mode is active (click to switch to dark)
 *   - "☀️" displayed when dark mode is active (click to switch to light)
 *
 * Per AAP Section 0.7.4:
 *   - Default theme is light mode (no data-theme attribute on initial load)
 *   - Theme preference is session-only — NO localStorage persistence
 */
themeToggle.addEventListener('click', function () {
    var currentTheme = document.documentElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        // Switch to light mode: remove the data-theme attribute entirely
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
    } else {
        // Switch to dark mode: set data-theme="dark" on <html>
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }
});

// ---------------------------------------------------------------------------
// Keyboard Support
// ---------------------------------------------------------------------------

/**
 * Handles keyboard shortcuts for the calculator.
 *
 * Key mappings:
 *   +       → Trigger addition (same as clicking the + button)
 *   -       → Trigger subtraction (only when input fields are NOT focused,
 *             to allow typing negative numbers in inputs)
 *   *       → Trigger multiplication (same as clicking the × button)
 *   /       → Trigger division (same as clicking the ÷ button)
 *   Enter   → Re-execute the last-used operation (no-op if none performed yet)
 *   Escape  → Clear all inputs and result (same as clicking Clear button)
 *
 * Safety rules (per AAP Section 0.7.4):
 *   - Does NOT override browser defaults for Tab, Ctrl+key, Alt+key, Meta+key
 *   - Only intercepts the six keys listed above
 *   - The '-' key is exempt when an input field is focused so users can type
 *     negative numbers (e.g., "-5")
 *   - For other operation keys (+, *, /), preventDefault is called when an
 *     input field is focused to prevent the character from appearing in the field
 */
document.addEventListener('keydown', function (e) {
    // Preserve all browser shortcuts that use modifier keys
    // (Ctrl+C, Ctrl+V, Ctrl+Z, Alt+Tab, Cmd+key, etc.)
    if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
    }

    var key = e.key;
    var activeElement = document.activeElement;
    var isInputFocused = (activeElement === input1 || activeElement === input2);

    // Handle operation keys (+, -, *, /)
    if (key in keyToOperation) {
        // Special case: '-' when an input field is focused
        // Allow typing negative numbers — do NOT intercept this keystroke
        if (key === '-' && isInputFocused) {
            return;
        }

        // For other operation keys when an input is focused, prevent the
        // character from appearing in the input field
        if (isInputFocused) {
            e.preventDefault();
        }

        // Execute the corresponding operation
        performOperation(keyToOperation[key]);
        return;
    }

    // Handle Enter key — re-execute the last-used operation
    if (key === 'Enter') {
        e.preventDefault();
        if (lastOperation !== null) {
            performOperation(lastOperation);
        }
        return;
    }

    // Handle Escape key — clear all (same behavior as clicking Clear button)
    if (key === 'Escape') {
        clearAll();
        return;
    }

    // All other keys: do nothing — let the browser handle them normally.
    // This preserves Tab navigation, standard text input, and all other defaults.
});
