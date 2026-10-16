/* Keep the chart editor controls in the same header on every analysis page. */
(() => {
  const actions = document.querySelector('.top-actions');
  if (!actions) return;
  let moving = false;
  function sync() {
    if (moving) return;
    moving = true;
    try {
      const entries = [...document.querySelectorAll('[data-quality-page-edit]')];
      const entry = entries.find(button => button.parentElement !== actions) || entries[0];
      if (entry) {
        entries.filter(button => button !== entry).forEach(button => button.remove());
        if (!entry.classList.contains('editor-header-entry')) {
          entry.classList.add('editor-header-entry');
          entry.setAttribute('aria-label', '编辑页面');
          entry.title = '编辑页面';
          entry.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 20h4l11-11-4-4L4 16v4Zm9.6-13.6 4 4M4 20h16"/></svg>';
        }
        if (entry.parentElement !== actions) {
          const host = entry.parentElement;
          const theme = actions.querySelector('.proto-theme-btn');
          if (theme) theme.after(entry);
          else actions.prepend(entry);
          if (host?.classList.contains('quality-page-edit-host') && !host.children.length) host.remove();
        }
      }
      const bar = document.querySelector('.quality-editor-bar');
      if (bar && bar.parentElement !== actions) actions.append(bar);
    } finally { moving = false; }
  }
  window.syncEditorHeader = sync;
  sync();
  const observer = new MutationObserver(() => sync());
  observer.observe(document.body, { childList: true, subtree: true });
})();
