(() => {
  if (document.body.dataset.page !== 'user-management') return;
  const table = document.querySelector('.records .table');
  const roleIndex = [...table.tHead.rows[0].cells].findIndex(cell => cell.textContent.trim() === '角色名称');
  const roles = ['平台管理员','质量工程师','设备管理员','生产主管','只读用户'];
  function open(row) {
    const modal = document.createElement('div'); modal.className = 'proto-backdrop user-access-backdrop';
    modal.innerHTML = '<section class="proto-modal" role="dialog" aria-modal="true" aria-label="'+(row?'编辑用户':'新增用户')+'"><header class="proto-modal-head"><h3>'+(row?'编辑用户':'新增用户')+'</h3><button class="proto-close" aria-label="关闭">×</button></header><div class="proto-modal-body"><div class="proto-field"><label>用户名称</label><input data-user-name placeholder="请输入用户名称"></div><div class="proto-field"><label>角色名称</label><select data-user-role></select></div>'+(row?'':'<div class="proto-field"><label>初始密码</label><input data-password type="password" autocomplete="new-password" placeholder="请输入初始密码"></div>')+'<div class="proto-field"><label>状态</label><select data-user-status><option value="enabled">启用</option><option value="disabled">停用</option></select></div><div class="user-access-error" role="alert"></div></div><footer class="proto-modal-foot"><button class="proto-secondary" data-cancel>取消</button><button class="proto-primary" data-user-save>保存</button></footer></section>';
    document.body.append(modal);
    const name = modal.querySelector('[data-user-name]'); name.value = row ? row.cells[roleIndex-1].textContent.trim() : '';
    const role = modal.querySelector('[data-user-role]'); roles.forEach(value=>role.add(new Option(value,value)));
    if (row) role.value = row.cells[roleIndex].textContent.trim();
    const status = modal.querySelector('[data-user-status]'); status.value = row?.querySelector('[data-user-status]')?.dataset.userStatus || 'enabled';
    modal.querySelector('.proto-close').onclick=modal.querySelector('[data-cancel]').onclick=()=>modal.remove();
    modal.querySelector('[data-user-save]').onclick=()=>{
      let error='';if(!name.value.trim())error='请输入用户名称';else if(!row&&!modal.querySelector('[data-password]').value)error='请输入初始密码';
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
