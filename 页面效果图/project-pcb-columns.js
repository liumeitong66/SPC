(() => {
  const table = document.querySelector('.pcb-table');
  const labels = [...window.SPCBoardExportFields.labels];
  labels.splice(6, 0, '整板SN', '拼板SN', '器件SN');
  const defaults = ['PCB ID','条码号','设备SN','设备名称','设备所在位置','机器判定','一次复判','一次复判操作员','最终复判','最终复判操作员','检测开始时间'];
  let selected = new Set(defaults), rows = [], name = '', detailUrl;
  const esc = value => String(value ?? '—').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const width = label => label === 'PCB ID' || label === '条码号' ? 230 : label.includes('时间') ? 180 : 160;
  function render() {
    const fields = labels.filter(label => selected.has(label));
    table.style.width = (192 + fields.reduce((sum, label) => sum + width(label), 0)) + 'px';
    table.innerHTML = '<colgroup><col style="width:52px"><col style="width:60px">'+fields.map(label=>`<col style="width:${width(label)}px">`).join('')+'<col style="width:80px"></colgroup><thead><tr><th><input type="checkbox" aria-label="全选"></th><th>序号</th>'+fields.map(label=>`<th>${label}</th>`).join('')+'<th>操作</th></tr></thead><tbody data-project-pcb-rows>'+rows.map((row,index)=>{
      const values = {'PCB ID':row.id,'条码号':row.barcode,'模板名称':name,'设备SN':row.sn,'设备名称':row.device,'设备所在位置':row.area,'机器判定':row.algorithm,'一次复判':row.review,'一次复判操作员':row.reviewer,'最终复判':row.second,'最终复判操作员':row.secondReviewer,'检测开始时间':row.time,'检测时长（s）':row.duration,'器件总数':row.total,'器件OK总数':row.ok};
      return `<tr><td><input type="checkbox" aria-label="选择 ${esc(row.id)}"></td><td>${index+1}</td>`+fields.map(label=>{
        const value=esc(values[label]);
        const status=['机器判定','一次复判','最终复判'].includes(label);
        const cls=['良好','直通'].includes(values[label])?'good':['不良','漏报'].includes(values[label])?'bad':values[label]==='—'?'muted':'review';
        return `<td title="${value}">${label==='PCB ID'?`<a href="#" class="detail-link" data-pcb-view>${value}</a>`:status?`<span class="status ${cls}">${value}</span>`:value}</td>`;
      }).join('')+`<td><a class="detail-link" href="${esc(detailUrl(row))}">详情</a></td></tr>`;
    }).join('')+'</tbody>';
    if(!rows.length) table.tBodies[0].innerHTML=`<tr class="pcb-empty-row"><td colspan="${fields.length+3}">暂无符合条件的 PCB</td></tr>`;
    table.querySelector('thead input').onchange = event => table.querySelectorAll('tbody input').forEach(input=>input.checked=event.target.checked);
  }
  table.addEventListener('click',event=>{const link=event.target.closest('[data-pcb-view]');if(link){event.preventDefault();window.SPCPrototype.toast('将打开 PCB“'+link.textContent+'”的整板视图（当前为演示，不执行实际跳转）','info');}});
  document.querySelector('[data-pcb-columns]').addEventListener('click',event=>{
    event.stopPropagation();
    const groups={'基础信息':labels.slice(0,9),'判定与复判':labels.slice(9,18),'器件统计':labels.slice(18,28),'缺陷类型统计':labels.slice(28)};
    const modal=window.SPCPrototype.openModal('显示列',`<div class="proto-column-toolbar"><span class="proto-column-note">已选择 <b data-column-count>${selected.size}</b> / ${labels.length} 列</span><div class="proto-column-actions"><button data-column-action="all">全选</button><button data-column-action="none">取消全选</button><button data-column-action="default">恢复默认</button></div></div><div class="proto-column-groups">${Object.entries(groups).map(([group,fields])=>`<section class="proto-column-group"><h4>${group}</h4><div class="proto-column-grid">${fields.map(label=>`<label class="proto-column-option"><input type="checkbox" value="${label}" ${selected.has(label)?'checked':''} ${label==='PCB ID'?'disabled':''}><span>${label}${label==='PCB ID'?'（必选）':''}</span></label>`).join('')}</div></section>`).join('')}</div>`,'应用列设置',root=>{selected=new Set(['PCB ID',...Array.from(root.querySelectorAll('.proto-column-option input:checked'),input=>input.value)]);render();});
    modal.querySelector('.proto-modal').classList.add('proto-column-modal');
    const inputs=[...modal.querySelectorAll('.proto-column-option input')];
    const count=()=>modal.querySelector('[data-column-count]').textContent=inputs.filter(input=>input.checked).length;
    inputs.forEach(input=>input.onchange=count);
    modal.querySelectorAll('[data-column-action]').forEach(button=>button.onclick=()=>{inputs.forEach(input=>input.checked=input.disabled||button.dataset.columnAction==='all'||button.dataset.columnAction==='default'&&defaults.includes(input.value));count();});
  });
  window.ProjectPCBTable={render(data,project,url){rows=data;name=project;detailUrl=url;render();}};
})();
