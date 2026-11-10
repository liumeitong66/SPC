(() => {
  const runtime = document.body.dataset.page === 'device-runtime-monitor';
  const table = document.querySelector(runtime ? '[data-runtime-table]' : '[data-device-table]');
  if (!table) return;
  const index = [...table.querySelectorAll('thead th')].findIndex(th=>/启用状态/.test(th.textContent));
  if(index>=0) [...table.rows].forEach(row=>{if(row.cells[index])row.cells[index].hidden=true});
  if(runtime){
    document.querySelectorAll('[data-runtime-device]').forEach(row=>{
      const connection=row.querySelector('[data-connection-cell]'),transmission=row.querySelector('[data-transmission-cell]');
      if(connection?.textContent==='未监控'){connection.textContent='未连接';connection.className='runtime-state danger'}
      if(transmission?.textContent==='未监控'){transmission.textContent='中断';transmission.className='runtime-state danger'}
    });
    const fix=()=>{document.querySelectorAll('[data-metric]').forEach(value=>{const label=value.parentElement.querySelector('label');const title={total:'全部设备',normal:'正常传输设备',disconnected:'未连接设备',transmissionAbnormal:'传输异常设备'}[value.dataset.metric];if(label&&title&&label.textContent!==title)label.textContent=title})};
    fix();new MutationObserver(fix).observe(document.querySelector('.metrics'),{subtree:true,childList:true,characterData:true});
    return;
  }
  const oldFilter=document.querySelector('#device-status-filter')?.closest('.field');if(oldFilter)oldFilter.hidden=true;
  table.querySelectorAll('tbody tr').forEach(row=>{
    const status=row.querySelector('[data-device-connection-status]');if(!status)return;
    const button=document.createElement('button');button.className='status-button';button.type='button';button.setAttribute('role','switch');
    let connected=status.textContent==='已连接';
    function paint(){button.classList.toggle('off',!connected);button.setAttribute('aria-checked',String(connected));button.setAttribute('aria-label',connected?'断开连接':'连接设备');button.title=connected?'已连接':'未连接';button.textContent=connected?'已连接':'未连接';row.querySelector('[data-proto-action="delete-device"]').disabled=connected}
    button.onclick=()=>{if(connected){window.SPCPrototype.confirmAction('确认断开连接','断开后平台将暂时无法接收该设备上传的数据，是否继续？',()=>{connected=false;paint()})}else{connected=true;paint()}};
    status.replaceWith(button);row.querySelectorAll('[data-device-connection-action]').forEach(action=>action.remove());paint();
  });
})();
