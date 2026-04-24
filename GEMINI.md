# GEMINI.md - Math Notebook | Advanced Pedagogical Calculator

## Project Overview
An interactive, single-file pedagogical math tool designed for students and educators. It provides visual, step-by-step logic for various mathematical operations.

## Architecture
- **Single-File App**: All HTML, CSS, and JavaScript are contained within `index.html`.
- **Zero Dependencies**: Pure Vanilla JS, CSS3, and HTML5. No external libraries (e.g., MathJax, Chart.js) are used to maintain portability and simplicity.
- **Tab-Based Navigation**: Features multiple specialized panels (Scientific, Fractions, Column Math, Trig, Grapher, Solver, Base Converter, Advanced Parser).

## Structural Breakdown of `index.html`
1. **HTML Body**: Tab bar followed by the main `.calculator` container housing individual `.panel` elements.
2. **CSS (`<style>`)**:
   - Uses CSS Variables (`:root`) for colors and themes.
   - Fixed width (`520px`) for the main container.
   - Custom grid-based background for the "Notebook" display.
   - Media queries for print-ready formatting.
3. **JavaScript (`<script>`)**:
   - **Tab Logic**: Simple `switchTab` function.
   - **Shunting-Yard Parser**: Converts infix to postfix and evaluates.
   - **Pedagogical Solvers**: Logic for generating visual grids (Column Math) and text explanations (Equation Solver).
   - **Visualizations**: SVG for the Unit Circle and Canvas for the Grapher.

## Coding Conventions & Guidelines
- **Maintain Single-File Integrity**: Keep all logic, styles, and markup in `index.html` unless a transition to a multi-file structure is explicitly requested.
- **Styling**: Always use the defined CSS variables (`--calc-bg`, `--text-main`, etc.) for consistency. Avoid hardcoding colors in JavaScript; prefer applying classes or using variables.
- **Pedagogy First**: When adding or modifying features, prioritize clear, step-by-step visual explanations.
- **Safety**: Be cautious with the `eval()` function currently used in the scientific calculator section. If refactoring, consider moving towards the Shunting-Yard parser.
- **Naming**:
  - CSS Classes: `btn-*` for buttons, `panel-*` for containers, `ld-*` for long division elements.
  - IDs: Use descriptive prefixes like `sci-`, `frac-`, `cm-`, `trig-`, `solve-`.
- **Interactive Elements**: Buttons often use inline `onclick` handlers. Maintain this pattern for existing features, or refactor all to event listeners if requested.

## Common Tasks
- **Adding a Tab**:
  1. Add a button to `.tab-bar` with `onclick="switchTab('yourname')"`.
  2. Create a `<div class="panel" id="panel-yourname">` inside `.calculator`.
  3. Implement the logic in a new section in the `<script>` tag.
- **Updating Visuals**: Update the `:root` variables in the CSS section.
