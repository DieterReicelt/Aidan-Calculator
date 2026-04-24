# GEMINI.md - Math Notebook | Advanced Pedagogical Calculator

## Project Overview
An interactive, single-file pedagogical math tool designed for students and educators. It provides visual, step-by-step logic for various mathematical operations.

## Architecture
- **Single-File App**: All HTML, CSS, and JavaScript are contained within `index.html`.
- **Zero Dependencies**: Pure Vanilla JS, CSS3, and HTML5. No external libraries are used to maintain portability.
- **Dropdown Navigation**: Features a single dropdown menu to switch between specialized panels.
- **Theme Support**: Includes "Dark Mode" and "Paper Mode" (Classic school notebook aesthetic).

## Structural Breakdown of `index.html`
1. **HTML Body**: Header with Theme Toggle, Dropdown navigation, and the main `.calculator` container.
2. **CSS (`<style>`)**:
   - Uses CSS Variables (`:root` and `.light-theme`) for dual-theme support.
   - Print-ready media queries for exporting solutions.
3. **JavaScript (`<script>`)**:
   - **Shunting-Yard Parser**: For scientific and advanced calculations.
   - **Geometry Engine**: SVG-based shape visualization.
   - **Factor Tree**: Recursive prime factorization logic.
   - **Stats Engine**: Basic data analysis and Canvas-based bar charts.

## Coding Conventions & Guidelines
- **Maintain Single-File Integrity**: Keep all logic, styles, and markup in `index.html`.
- **Styling**: Always use the defined CSS variables for theme compatibility.
- **Pedagogy First**: Prioritize clear, step-by-step visual explanations.

## Common Tasks
- **Adding a Section**:
  1. Add an `<option value="yourname">Text</option>` to the `.tab-select` dropdown.
  2. Create a `<div class="panel" id="panel-yourname">` inside `.calculator`.
  3. Implement the logic in a new section in the `<script>` tag.
- **Updating Themes**: Modify the `:root` or `.light-theme` variables in the CSS section.
