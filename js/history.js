/**
 * history.js — Calculation History Management Module
 *
 * Manages an in-memory array of past calculations with functions to add entries,
 * retrieve the history, clear the history, and render entries to the DOM.
 *
 * This module has ZERO dependencies on calculator.js or app.js.
 * All four public functions are exposed in the global scope for app.js to call.
 *
 * Load order in index.html: calculator.js → history.js → app.js
 *
 * Browser compatibility: Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+
 */

// ---------------------------------------------------------------------------
// Private Data Store
// ---------------------------------------------------------------------------

/**
 * In-memory array storing calculation history entries.
 * Each entry is an object with { expression: string, result: number|string }.
 * Not directly accessible from outside — only through the public API functions.
 */
var historyEntries = [];

// ---------------------------------------------------------------------------
// Public API Functions
// ---------------------------------------------------------------------------

/**
 * Adds a new calculation entry to the history.
 *
 * @param {string} expression - The formatted expression string (e.g., "25 + 10")
 * @param {number|string} result - The computation result (e.g., 35)
 *
 * @example
 *   addEntry("25 + 10", 35);
 *   addEntry("100 / 4", 25);
 *   addEntry("10 / 0", "Cannot divide by zero");
 */
function addEntry(expression, result) {
    historyEntries.push({
        expression: expression,
        result: result
    });
}

/**
 * Returns the current history entries array.
 *
 * @returns {Array<{expression: string, result: number|string}>} The history array
 *
 * @example
 *   var history = getHistory();
 *   console.log(history.length); // number of entries
 */
function getHistory() {
    return historyEntries;
}

/**
 * Clears all entries from the calculation history.
 * After calling this, getHistory() returns an empty array.
 * Does NOT modify the DOM — call renderHistory() separately to update the UI.
 *
 * @example
 *   clearHistory();
 *   console.log(getHistory().length); // 0
 */
function clearHistory() {
    historyEntries = [];
}

/**
 * Renders all history entries into the provided DOM container element.
 * This is the ONLY function in this module that interacts with the DOM.
 * The container is received as a parameter (dependency injection) — this
 * function does NOT use document.querySelector() internally.
 *
 * @param {HTMLElement} containerElement - The DOM element to render history into
 *                                         (typically <ul id="history-list">)
 *
 * @example
 *   var container = document.querySelector('#history-list');
 *   renderHistory(container);
 *   // Container now has <li> children for each history entry
 */
function renderHistory(containerElement) {
    // Clear any existing content in the container
    containerElement.innerHTML = '';

    // Iterate over all history entries and create <li> elements
    historyEntries.forEach(function (entry) {
        var li = document.createElement('li');
        li.textContent = entry.expression + ' = ' + entry.result;
        containerElement.appendChild(li);
    });
}
