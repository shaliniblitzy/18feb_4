/**
 * history.test.js — Unit Tests for js/history.js
 *
 * Comprehensive test suite covering all four public functions of the history
 * management module: addEntry, getHistory, clearHistory, and renderHistory.
 *
 * This file is loaded via <script> tag in tests/calculator.test.html AFTER
 * js/history.js has been loaded. All functions from history.js (addEntry,
 * getHistory, clearHistory, renderHistory) and the assertion library (assert,
 * assertEqual, assertStrictEqual, describe) are available in the global scope.
 *
 * Each describe block calls clearHistory() at the start to ensure test
 * isolation — no test group depends on state left by a previous group.
 *
 * Browser compatibility: Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+
 * Uses only var declarations and standard DOM APIs for maximum compatibility.
 */

// ============================================================================
// addEntry() Tests
// ============================================================================

describe('addEntry() function', function () {

    // Ensure clean state before this test group
    clearHistory();

    // Test: Adding a single entry increases history length to 1
    addEntry('25 + 10', 35);
    assertEqual(getHistory().length, 1, 'addEntry increases history length to 1');

    // Test: The entry object has the correct expression property
    assertEqual(getHistory()[0].expression, '25 + 10', 'Entry has correct expression property');

    // Test: The entry object has the correct result property
    assertEqual(getHistory()[0].result, 35, 'Entry has correct result property');

    // Test: Adding a second entry increases history length to 2
    addEntry('100 / 4', 25);
    assertEqual(getHistory().length, 2, 'addEntry increases history length to 2 after second call');

    // Test: Multiple entries are stored in insertion order
    assertEqual(getHistory()[0].expression, '25 + 10', 'First entry remains at index 0 after second add');
    assertEqual(getHistory()[1].expression, '100 / 4', 'Second entry is at index 1');
    assertEqual(getHistory()[1].result, 25, 'Second entry has correct result');

    // Test: addEntry works with subtraction expressions
    clearHistory();
    addEntry('5 - 3', 2);
    assertEqual(getHistory()[0].expression, '5 - 3', 'addEntry works with subtraction expression');
    assertEqual(getHistory()[0].result, 2, 'Subtraction entry has correct result');

    // Test: addEntry works with multiplication expressions
    clearHistory();
    addEntry('3 * 7', 21);
    assertEqual(getHistory()[0].expression, '3 * 7', 'addEntry works with multiplication expression');
    assertEqual(getHistory()[0].result, 21, 'Multiplication entry has correct result');

    // Test: addEntry works with division expressions
    clearHistory();
    addEntry('100 / 4', 25);
    assertEqual(getHistory()[0].expression, '100 / 4', 'addEntry works with division expression');
    assertEqual(getHistory()[0].result, 25, 'Division entry has correct result');

    // Test: addEntry handles string results (e.g., error messages)
    clearHistory();
    addEntry('10 / 0', 'Cannot divide by zero');
    assertEqual(getHistory()[0].expression, '10 / 0', 'Entry with string result has correct expression');
    assertStrictEqual(getHistory()[0].result, 'Cannot divide by zero', 'Entry stores string result correctly');

    // Test: addEntry handles decimal results
    clearHistory();
    addEntry('7 / 2', 3.5);
    assertEqual(getHistory()[0].result, 3.5, 'addEntry stores decimal results correctly');

    // Test: addEntry handles negative results
    clearHistory();
    addEntry('3 - 10', -7);
    assertEqual(getHistory()[0].result, -7, 'addEntry stores negative results correctly');

    // Test: addEntry handles zero as a result
    clearHistory();
    addEntry('5 - 5', 0);
    assertEqual(getHistory()[0].result, 0, 'addEntry stores zero result correctly');
});

// ============================================================================
// getHistory() Tests
// ============================================================================

describe('getHistory() function', function () {

    // Ensure clean state before this test group
    clearHistory();

    // Test: getHistory returns an array
    assert(Array.isArray(getHistory()), 'getHistory returns an array');

    // Test: getHistory returns an empty array initially (after clear)
    assertEqual(getHistory().length, 0, 'getHistory returns empty array after clearHistory');

    // Test: After adding entries, getHistory returns all entries
    addEntry('10 + 5', 15);
    addEntry('20 - 3', 17);
    assertEqual(getHistory().length, 2, 'getHistory returns all entries after adding two');

    // Test: Entries are returned in insertion order
    assertEqual(getHistory()[0].expression, '10 + 5', 'First entry expression is correct');
    assertEqual(getHistory()[0].result, 15, 'First entry result is correct');
    assertEqual(getHistory()[1].expression, '20 - 3', 'Second entry expression is correct');
    assertEqual(getHistory()[1].result, 17, 'Second entry result is correct');

    // Test: Each entry object has both expression and result properties
    var firstEntry = getHistory()[0];
    assert(firstEntry.hasOwnProperty('expression'), 'Entry object has expression property');
    assert(firstEntry.hasOwnProperty('result'), 'Entry object has result property');

    // Test: Adding a third entry is reflected in getHistory
    addEntry('4 * 8', 32);
    assertEqual(getHistory().length, 3, 'getHistory reflects newly added third entry');
    assertEqual(getHistory()[2].expression, '4 * 8', 'Third entry is at correct index');
    assertEqual(getHistory()[2].result, 32, 'Third entry result is correct');
});

// ============================================================================
// clearHistory() Tests
// ============================================================================

describe('clearHistory() function', function () {

    // Ensure clean state before this test group
    clearHistory();

    // Setup: Add entries before testing clear
    addEntry('5 + 5', 10);
    addEntry('10 * 2', 20);
    assertEqual(getHistory().length, 2, 'History has 2 entries before clear');

    // Test: clearHistory empties the array
    clearHistory();
    assertEqual(getHistory().length, 0, 'clearHistory empties the array');

    // Test: getHistory returns an array (not null/undefined) after clear
    assert(Array.isArray(getHistory()), 'getHistory still returns an array after clear');

    // Test: Calling clearHistory on already-empty history does not throw
    var noError = true;
    try {
        clearHistory();
    } catch (e) {
        noError = false;
    }
    assert(noError, 'clearHistory on empty history does not throw an error');
    assertEqual(getHistory().length, 0, 'History remains empty after clearing empty history');

    // Test: After clearHistory, new entries can be added normally
    addEntry('1 + 1', 2);
    assertEqual(getHistory().length, 1, 'Can add entries after clearing');
    assertEqual(getHistory()[0].expression, '1 + 1', 'New entry after clear has correct expression');
    assertEqual(getHistory()[0].result, 2, 'New entry after clear has correct result');

    // Test: Multiple clear-add cycles work correctly
    clearHistory();
    addEntry('9 - 4', 5);
    addEntry('8 / 2', 4);
    assertEqual(getHistory().length, 2, 'Second cycle: two entries added after clear');
    clearHistory();
    assertEqual(getHistory().length, 0, 'Second cycle: clearHistory empties again');
});

// ============================================================================
// renderHistory() Tests
// ============================================================================

describe('renderHistory() function', function () {

    // Ensure clean state before this test group
    clearHistory();

    // Create a mock container for testing renderHistory (real DOM element)
    var mockContainer = document.createElement('ul');

    // Test: renderHistory populates the container with <li> children
    addEntry('25 + 10', 35);
    addEntry('100 / 4', 25);
    renderHistory(mockContainer);
    assertEqual(mockContainer.children.length, 2, 'renderHistory creates correct number of li elements');

    // Test: First <li> text content matches expected format
    assertEqual(mockContainer.children[0].textContent, '25 + 10 = 35', 'First li has correct text format');

    // Test: Second <li> text content matches expected format
    assertEqual(mockContainer.children[1].textContent, '100 / 4 = 25', 'Second li has correct text format');

    // Test: Each child is an <li> element
    assertEqual(mockContainer.children[0].tagName, 'LI', 'First child is an LI element');
    assertEqual(mockContainer.children[1].tagName, 'LI', 'Second child is an LI element');

    // Test: Re-rendering does not duplicate entries (idempotency)
    renderHistory(mockContainer);
    assertEqual(mockContainer.children.length, 2, 'Re-rendering does not duplicate entries');
    assertEqual(mockContainer.children[0].textContent, '25 + 10 = 35', 'Content is same after re-render');

    // Test: renderHistory with empty history renders nothing
    clearHistory();
    renderHistory(mockContainer);
    assertEqual(mockContainer.children.length, 0, 'renderHistory with empty history renders nothing');

    // Test: renderHistory receives the container as a parameter (different container works)
    clearHistory();
    addEntry('7 * 3', 21);
    var anotherContainer = document.createElement('ul');
    renderHistory(anotherContainer);
    assertEqual(anotherContainer.children.length, 1, 'renderHistory works with a different container element');
    assertEqual(anotherContainer.children[0].textContent, '7 * 3 = 21', 'Different container has correct content');

    // Test: Text format uses spaces around the equals sign
    clearHistory();
    addEntry('50 - 25', 25);
    var formatContainer = document.createElement('ul');
    renderHistory(formatContainer);
    var renderedText = formatContainer.children[0].textContent;
    assert(renderedText.indexOf(' = ') !== -1, 'Rendered text contains spaces around equals sign');
    assertStrictEqual(renderedText, '50 - 25 = 25', 'Exact text format: "{expression} = {result}"');

    // Test: renderHistory handles string results in entries
    clearHistory();
    addEntry('10 / 0', 'Cannot divide by zero');
    var errorContainer = document.createElement('ul');
    renderHistory(errorContainer);
    assertEqual(errorContainer.children.length, 1, 'renderHistory renders entries with string results');
    assertStrictEqual(
        errorContainer.children[0].textContent,
        '10 / 0 = Cannot divide by zero',
        'String result is rendered correctly in text format'
    );

    // Test: renderHistory handles multiple entries with various operations
    clearHistory();
    addEntry('1 + 1', 2);
    addEntry('10 - 3', 7);
    addEntry('4 * 5', 20);
    addEntry('15 / 3', 5);
    var multiContainer = document.createElement('ul');
    renderHistory(multiContainer);
    assertEqual(multiContainer.children.length, 4, 'renderHistory handles four entries correctly');
    assertEqual(multiContainer.children[0].textContent, '1 + 1 = 2', 'Multi-entry: first is correct');
    assertEqual(multiContainer.children[1].textContent, '10 - 3 = 7', 'Multi-entry: second is correct');
    assertEqual(multiContainer.children[2].textContent, '4 * 5 = 20', 'Multi-entry: third is correct');
    assertEqual(multiContainer.children[3].textContent, '15 / 3 = 5', 'Multi-entry: fourth is correct');
});

// ============================================================================
// Integration / Sequence Tests
// ============================================================================

describe('History Module Integration', function () {

    // Ensure clean state before this test group
    clearHistory();

    // Test: Full lifecycle — add → get → render → clear → re-add
    addEntry('1 + 1', 2);
    addEntry('2 * 3', 6);
    addEntry('10 - 4', 6);

    // Verify entries via getHistory
    assertEqual(getHistory().length, 3, 'Integration: three entries added');
    assertEqual(getHistory()[0].expression, '1 + 1', 'Integration: first entry expression correct');
    assertEqual(getHistory()[1].expression, '2 * 3', 'Integration: second entry expression correct');
    assertEqual(getHistory()[2].expression, '10 - 4', 'Integration: third entry expression correct');

    // Render and verify DOM output
    var container = document.createElement('ul');
    renderHistory(container);
    assertEqual(container.children.length, 3, 'Integration: three li elements rendered');
    assertEqual(container.children[0].textContent, '1 + 1 = 2', 'Integration: first rendered entry correct');
    assertEqual(container.children[1].textContent, '2 * 3 = 6', 'Integration: second rendered entry correct');
    assertEqual(container.children[2].textContent, '10 - 4 = 6', 'Integration: third rendered entry correct');

    // Clear and verify everything resets
    clearHistory();
    assertEqual(getHistory().length, 0, 'Integration: history cleared');
    renderHistory(container);
    assertEqual(container.children.length, 0, 'Integration: rendered list cleared');

    // Re-add entries and verify the module still works correctly
    addEntry('100 + 200', 300);
    assertEqual(getHistory().length, 1, 'Integration: can add entry after full clear cycle');
    renderHistory(container);
    assertEqual(container.children.length, 1, 'Integration: can render after full clear cycle');
    assertEqual(container.children[0].textContent, '100 + 200 = 300', 'Integration: re-added entry renders correctly');

    // Final state verification
    var finalHistory = getHistory();
    assert(Array.isArray(finalHistory), 'Integration: final getHistory returns array');
    assertEqual(finalHistory.length, 1, 'Integration: final history has exactly 1 entry');
    assertEqual(finalHistory[0].expression, '100 + 200', 'Integration: final entry expression is correct');
    assertEqual(finalHistory[0].result, 300, 'Integration: final entry result is correct');
});
