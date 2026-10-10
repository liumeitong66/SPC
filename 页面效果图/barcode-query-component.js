(() => {
  const qrIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM19 14h2v2h-2zM19 19h2v2h-2zM15 19h2v2h-2z" fill="currentColor"/></svg>';
  const openScan=event=>{
    const button=event.target.closest('[data-barcode-scan]');
    if(!button)return;
    event.preventDefault();event.stopImmediatePropagation();
    const field=button.closest('.field'),input=field?.querySelector('input[aria-label="条码号"]');
    if(!input)return;
    const modal=window.SPCPrototype.openModal('条码号',`<div class="board-modal-field"><input data-scan-value aria-label="条码号" placeholder="扫码录入或输入">${qrIcon}</div>`,'确认',root=>{
      const value=root.querySelector('[data-scan-value]').value.trim();
      if(!value){root.querySelector('[data-scan-value]').focus();return false}
      input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));
      field.closest('.filters')?.querySelector('.btn.primary')?.click();
    });
    modal.querySelector('[data-scan-value]').addEventListener('keydown',keyEvent=>{if(keyEvent.key==='Enter'){keyEvent.preventDefault();modal.querySelector('[data-confirm]').click()}});
  };
  document.addEventListener('click',event=>{if(event.target.closest('[data-barcode-scan]'))openScan(event)},true);
})();
