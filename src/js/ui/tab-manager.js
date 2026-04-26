export class TabManager {
  static init() {
    // Initialization logic if needed
  }

  static switchTab(name) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    const activePanel = document.getElementById('panel-' + name);
    if (activePanel) {
      activePanel.classList.add('active');
    }
    
    // Trigger module-specific rendering if needed
    // This will be handled by event emitters in the full version
    window.dispatchEvent(new CustomEvent('tab-switched', { detail: { name } }));
  }
}