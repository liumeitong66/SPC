(() => {
  const page=document.body.dataset.page;
  if(page==='device-management'||page==='user-management'){
    const attr=page==='device-management'?'data-device-status':'data-user-status';
    const sync=()=>document.querySelectorAll('.status-button['+attr+']').forEach(button=>{button.setAttribute('role','switch');button.setAttribute('aria-checked',String(button.getAttribute(attr)==='enabled'));button.setAttribute('aria-label',button.getAttribute(attr)==='enabled'?'启用':'停用')});
    sync();new MutationObserver(sync).observe(document.querySelector('.table tbody'),{attributes:true,childList:true,subtree:true,attributeFilter:[attr]});
  }
  if(page!=='user-management'&&page!=='role-management')return;
  const table=document.querySelector('.records .table'),head=table.tHead.rows[0],rows=[...table.tBodies[0].rows],actionHead=head.lastElementChild;
  ['创建时间','更新时间','操作人'].forEach(label=>{const cell=document.createElement('th');cell.textContent=label;head.insertBefore(cell,actionHead)});
  const created=['2026-07-28 09:20:14','2026-07-29 10:08:35','2026-07-30 14:45:21'];
  const updated=['2026-08-04 14:20:34','2026-08-04 14:18:09','2026-08-03 22:16:10'];
  rows.forEach((row,index)=>{
    const operation=row.lastElementChild;
    [created[index],updated[index],'admin'].forEach(value=>{const cell=document.createElement('td');cell.textContent=value;operation.before(cell)});
    if(page!=='role-management')return;
    operation.classList.add('role-action-cell');
    const edit=operation.querySelector('[data-proto-action="edit-role"]'),permissions=operation.querySelector('[data-proto-action="menu-permissions"]'),remove=operation.querySelector('[data-proto-action="delete-role"]');
    operation.replaceChildren();
    const container=document.createElement('span');container.className='role-operation';
    const wrap=document.createElement('span');wrap.className='role-more-wrap';
    const trigger=document.createElement('button');trigger.type='button';trigger.className='action-btn role-more-trigger';trigger.textContent='更多';trigger.setAttribute('aria-expanded','false');
    const menu=document.createElement('span');menu.className='role-more-menu';menu.hidden=true;menu.append(permissions,remove);wrap.append(trigger,menu);container.append(edit,wrap);operation.append(container);
    trigger.addEventListener('click',event=>{event.stopPropagation();document.querySelectorAll('.role-more-menu').forEach(other=>{if(other!==menu)other.hidden=true});menu.hidden=!menu.hidden;trigger.setAttribute('aria-expanded',String(!menu.hidden))});
  });
  document.addEventListener('click',event=>{if(event.target.closest('.role-more-wrap'))return;document.querySelectorAll('.role-more-menu').forEach(menu=>menu.hidden=true)});
})();
