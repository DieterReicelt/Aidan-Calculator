export class ThemeManager {
  static #themeText = null;

  static init() {
    this.#themeText = document.getElementById('theme-text');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      if (this.#themeText) this.#themeText.textContent = 'Paper Mode';
    }
  }

  static toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    if (this.#themeText) {
      this.#themeText.textContent = isLight ? 'Paper Mode' : 'Dark Mode';
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }
}