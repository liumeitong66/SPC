(() => {
  if (document.body.dataset.page !== 'user-management') return;
  const table = document.querySelector('.records .table');
  const roleIndex = [...table.tHead.rows[0].cells].findIndex(cell => cell.textContent.trim() === '角色名称');
  const th = document.createElement('th'); th.textContent = '可访问设备';
  table.tHead.rows[0].cells[roleIndex].after(th);
  const devices = [
    {area:'区域A',name:'AOI-01',sn:'SI1020E1112'}, {area:'区域B',name:'AOI-02',sn:'SI1020E1148'},
    {area:'区域C',name:'AOI-03',sn:'SI1020E1186'}, {area:'区域D',name:'AOI-04',sn:'SI1020E1206'},
    {area:'区域B',name:'AOI-05',sn:'SI1020E1238'}
  ];
  const roles = ['平台管理员','质量工程师','设备管理员','生产主管','只读用户'];
  const access = new WeakMap();
  function paint(row, config) {
    access.set(row, config);
    let cell = row.querySelector('.user-access-cell');
    if (!cell) { cell = document.createElement('td'); cell.className = 'user-access-cell'; row.cells[roleIndex].after(cell); }
    cell.textContent = config.all ? '全部设备' : config.names.join('、'); cell.title = cell.textContent;
  }
  [...table.tBodies[0].rows].forEach((row,index) => paint(row,{all:index === 0,names:index === 1 ? ['AOI-01','AOI-02','AOI-03'] : ['AOI-04','AOI-05']}));
  function open(row) {
    const current = row ? access.get(row) : {all:true,names:[]};
    const modal = document.createElement('div'); modal.className = 'proto-backdrop user-access-backdrop';
    modal.innerHTML = '<section class="proto-modal" role="dialog" aria-modal="true" aria-label="'+(row?'编辑用户':'新增用户')+'"><header class="proto-modal-head"><h3>'+(row?'编辑用户':'新增用户')+'</h3><button class="proto-close" aria-label="关闭">×</button></header><div class="proto-modal-body"><div class="proto-field"><label>用户名称</label><input data-user-name placeholder="请输入用户名称"></div><div class="proto-field"><label>角色名称</label><select data-user-role></select></div>'+(row?'':'<div class="proto-field"><label>初始密码</label><input data-password type="password" autocomplete="new-password" placeholder="请输入初始密码"></div>')+'<div class="proto-field"><label>可访问设备</label><div class="user-access-mode"><label><input type="radio" name="user-access-mode" value="all"> 全部设备</label><label><input type="radio" name="user-access-mode" value="selected"> 指定设备</label></div><div class="user-access-hint"></div><details class="user-device-picker"><summary>请选择设备</summary><div class="user-device-menu"><input type="search" placeholder="搜索设备名称、SN或区域" aria-label="搜索设备"><div class="user-device-tree"></div></div></details></div><div class="proto-field"><label>状态</label><select data-user-status><option value="enabled">启用</option><option value="disabled">停用</option></select></div><div class="user-access-error" role="alert"></div></div><footer class="proto-modal-foot"><button class="proto-secondary" data-cancel>取消</button><button class="proto-primary" data-user-save>保存</button></footer></section>';
    document.body.append(modal);
    const name = modal.querySelector('[data-user-name]'); name.value = row ? row.cells[roleIndex-1].textContent.trim() : '';
    const role = modal.querySelector('[data-user-role]'); roles.forEach(value=>role.add(new Option(value,value)));
    if (row) role.value = row.cells[roleIndex].textContent.trim();
    const status = modal.querySelector('[data-user-status]'); status.value = row?.querySelector('[data-user-status]')?.dataset.userStatus || 'enabled';
    const picker = modal.querySelector('.user-device-picker'), tree = modal.querySelector('.user-device-tree');
    [...new Set(devices.map(d=>d.area))].forEach(area => {
      const group = document.createElement('details'); group.open = true;
      const summary = document.createElement('summary'); const label = document.createElement('label');
      const check = document.createElement('input'); check.type = 'checkbox'; label.append(check,document.createTextNode(area)); summary.append(label); group.append(summary);
      devices.filter(d=>d.area===area).forEach(device=>{
        const leaf = document.createElement('label'); leaf.className = 'user-device-leaf'; leaf.dataset.search = (device.area+' '+device.name+' '+device.sn).toLowerCase();
        const input = document.createElement('input'); input.type='checkbox'; input.value=device.name; input.checked=current.names.includes(device.name);
        leaf.append(input,document.createTextNode(device.name)); group.append(leaf);
      });
      check.onchange=()=>{group.querySelectorAll('.user-device-leaf input').forEach(input=>input.checked=check.checked);refresh()};
      tree.append(group);
    });
    function refresh() {
      const all = modal.querySelector('[name="user-access-mode"]:checked').value === 'all';
      picker.hidden=all; if(all)picker.open=false;
      modal.querySelector('.user-access-hint').textContent=all?'包含以后新接入的设备':'仅所选设备，新接入设备不会自动授权';
      const selected=[...tree.querySelectorAll('.user-device-leaf input:checked')].map(input=>input.value);
      picker.querySelector('summary').textContent=selected.length?selected.join('、'):'请选择设备';
      tree.querySelectorAll('details').forEach(group=>{const inputs=[...group.querySelectorAll('.user-device-leaf input')],check=group.querySelector('summary input');check.checked=inputs.every(i=>i.checked);check.indeterminate=inputs.some(i=>i.checked)&&!check.checked});
    }
    modal.querySelector('[value="'+(current.all?'all':'selected')+'"]').checked=true;
    modal.addEventListener('change',refresh); refresh();
    modal.querySelector('input[type=search]').oninput=event=>{
      const query=event.target.value.trim().toLowerCase();tree.querySelectorAll('details').forEach(group=>{let visible=false;group.querySelectorAll('.user-device-leaf').forEach(leaf=>{leaf.hidden=!leaf.dataset.search.includes(query);if(!leaf.hidden)visible=true});group.hidden=!visible;group.open=true});
    };
    modal.querySelector('.proto-close').onclick=modal.querySelector('[data-cancel]').onclick=()=>modal.remove();
    modal.querySelector('[data-user-save]').onclick=()=>{
      const config={all:modal.querySelector('[name="user-access-mode"]:checked').value==='all',names:[...tree.querySelectorAll('.user-device-leaf input:checked')].map(i=>i.value)};
      let error='';if(!name.value.trim())error='请输入用户名称';else if(!config.all&&!config.names.length)error='请选择至少一台设备';else if(!row&&!modal.querySelector('[data-password]').value)error='请输入初始密码';
      modal.querySelector('.user-access-error').textContent=error;if(error)return;
      let target=row;
      if(!target){target=table.tBodies[0].rows[0].cloneNode(true);table.tBodies[0].append(target);}
      target.cells[roleIndex-1].textContent=name.value.trim();target.cells[roleIndex-1].title=name.value.trim();target.cells[roleIndex].textContent=role.value;target.cells[roleIndex].title=role.value;
      const now = new Date().toLocaleString('sv-SE');
      [...table.tHead.rows[0].cells].forEach((head,index)=>{
        if(head.textContent.trim()==='更新时间')target.cells[index].textContent=now;
        if(head.textContent.trim()==='操作人')target.cells[index].textContent='admin';
      });
      const toggle=target.querySelector('[data-user-status]');toggle.dataset.userStatus=status.value;toggle.classList.toggle('off',status.value==='disabled');toggle.setAttribute('aria-checked',String(status.value==='enabled'));
      const remove=target.querySelector('[data-proto-action="delete-user"]');if(remove)remove.disabled=status.value==='enabled';
      paint(target,config);
      const count=table.tBodies[0].rows.length;
      const summary=document.querySelector('.records .pager>span');if(summary)summary.textContent='共 '+count+' 条';
      [...table.tBodies[0].rows].forEach((entry,index)=>{if(table.tHead.rows[0].cells[0].textContent.trim()==='序号')entry.cells[0].textContent=String(index+1)});
      modal.remove();
    };
    name.focus();
  }
  window.addEventListener('click',event=>{
    const button=event.target.closest('[data-proto-action="add-user"],[data-proto-action="edit-user"]');if(!button)return;
    event.preventDefault();event.stopImmediatePropagation();open(button.dataset.protoAction==='edit-user'?button.closest('tr'):null);
  },true);
})();
