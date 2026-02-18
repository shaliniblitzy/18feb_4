# Simple Calculator

A clean, browser-based calculator application built with vanilla HTML, CSS, and JavaScript. It accepts two numeric inputs from the user, allows selection of a basic arithmetic operation (+, −, ×, ÷), and displays the computed result — all within a simple, responsive interface. No external dependencies, no build step, no server required.

## Features

### Core Features

- **Dual Numeric Input** — Two dedicated input fields for entering numeric values
- **Four Arithmetic Operations** — Addition (+), Subtraction (−), Multiplication (×), Division (÷) via dedicated buttons
- **Result Display** — A clearly visible display area shows the computed result after each operation
- **Clear / Reset** — A "Clear" button resets both input fields and the result display to their initial state
- **Continuous Usage** — Perform multiple sequential calculations without restarting the application or refreshing the page
- **Error Handling** — Graceful handling of division by zero, empty inputs, and non-numeric input with specific user-facing messages

### Bonus Features

- **Calculation History Log** — A running log of past calculations and their results displayed below the calculator
- **Keyboard Support** — Enter numbers and trigger operations via keyboard input (see [Keyboard Shortcuts](#keyboard-shortcuts))
- **Dark Mode / Light Mode Toggle** — A visual theme switcher between light and dark color schemes

## Usage Instructions

1. Open `index.html` in any modern web browser
2. Enter a number in the **Input 1** field
3. Enter a number in the **Input 2** field
4. Click one of the operation buttons (**+**, **−**, **×**, **÷**) to perform the calculation
5. View the result in the display area below the buttons
6. Click the **Clear** button to reset both inputs and the result
7. Toggle the theme button to switch between light and dark modes

### Example

```
Input 1:  25
Input 2:  10
Operation: +
Result:   35
```

## Project Structure

```
/
├── index.html                  Main application entry point (calculator UI)
├── README.md                   Project documentation
├── .gitignore                  Git ignore patterns
├── css/
│   └── styles.css              Application styling and light/dark themes
├── js/
│   ├── calculator.js           Core arithmetic functions and input validation
│   ├── app.js                  Application controller — event handlers and DOM binding
│   └── history.js              Calculation history management and rendering
└── tests/
    ├── calculator.test.html    Browser-based unit test runner
    ├── calculator.test.js      Unit tests for calculator logic
    └── history.test.js         Unit tests for history module
```

| File | Description |
|------|-------------|
| `index.html` | Main HTML document defining the calculator UI — input fields, operation buttons, result display, clear button, history panel, and theme toggle |
| `css/styles.css` | Complete stylesheet with CSS custom properties for theming, responsive layout, button states, and dark/light mode definitions |
| `js/calculator.js` | Pure calculation functions (`add`, `subtract`, `multiply`, `divide`) and input validation (`validate`) — no DOM dependencies |
| `js/app.js` | Application initialization — DOM event listeners for buttons, keyboard shortcuts, theme toggle, and result display updates |
| `js/history.js` | Array-based history store with functions to add entries, clear history, and render the history list to the DOM |
| `tests/calculator.test.html` | HTML test runner page that loads test scripts and displays pass/fail results in the browser |
| `tests/calculator.test.js` | Test cases covering all arithmetic operations, division-by-zero handling, empty input validation, and non-numeric input validation |
| `tests/history.test.js` | Test cases for history entry creation, history clearing, and history rendering |

## Error Handling

The application handles three edge-case scenarios with specific error messages displayed in the result area:

| Scenario | Condition | Error Message |
|----------|-----------|---------------|
| Division by zero | User selects ÷ and the second input is `0` | `"Cannot divide by zero"` |
| Empty input fields | Either input field is left empty | `"Please enter both numbers"` |
| Non-numeric input | Either input contains non-numeric characters | `"Invalid input, please enter numbers only"` |

Validation priority: empty-field checks execute before non-numeric checks to ensure the correct message is displayed.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `+` | Trigger addition operation |
| `-` | Trigger subtraction operation |
| `*` | Trigger multiplication operation |
| `/` | Trigger division operation |
| `Enter` | Execute the last-used or default operation |
| `Escape` | Clear inputs and result |

Standard keyboard navigation (e.g., `Tab` to move between fields) is preserved and not overridden.

## Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 49+ |
| Firefox | 31+ |
| Safari | 9.1+ |
| Edge | 15+ |

- **No external dependencies** — zero-install, zero-build
- **No server required** — open `index.html` directly in a browser or serve via any static file server
- Built entirely with native HTML5, CSS3, and ES6+ JavaScript APIs

## Running Tests

Open `tests/calculator.test.html` in any supported browser to execute the unit test suite. Test results (pass/fail) are displayed directly in the page.

```bash
# Option 1: Open the test runner directly
open tests/calculator.test.html

# Option 2: Serve via a local HTTP server and navigate to the test page
python3 -m http.server 8080
# Then open http://localhost:8080/tests/calculator.test.html in your browser
```

The test suite covers:

- All four arithmetic operations with positive, negative, and decimal inputs
- Division by zero returns `"Cannot divide by zero"`
- Empty input validation returns `"Please enter both numbers"`
- Non-numeric input validation returns `"Invalid input, please enter numbers only"`
- History entry creation, retrieval, clearing, and rendering

## License

This project is provided as-is for educational and demonstration purposes.
