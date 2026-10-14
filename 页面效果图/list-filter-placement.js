(() => {
  const targets={
    'project-statistics':['.filters','.table-panel','.panel-head'],
    'project-stats':['.filters','.table-panel','.panel-head'],
    'project-detail':['.project-detail-filters','.project-pcb-panel','.phead'],
    'defect-analysis':['.table-filters','.table-panel','.table-title'],
    'device-runtime-monitor':['.runtime-filters','.records','.phead'],
    'device-quality':['.quality-filter','.table-panel','.panel-head'],
    'device-management':['.management-filters','.device-list-pane','.management-toolbar']
  };
  const page=document.body.dataset.page||(document.body.dataset.mouthPage==='project'||document.title.includes('项目统计')?'project-stats':''),setting=targets[page];if(!setting)return;
  function place(){
    const [filterSelector,panelSelector,headingSelector]=setting;
    const filter=document.querySelector(filterSelector),panel=document.querySelector(panelSelector),heading=panel?.querySelector(headingSelector);
    if(!filter||!panel||!heading||filter.hasAttribute('data-list-filter-placed'))return;
    if(heading.nextElementSibling!==filter)heading.after(filter);
    filter.setAttribute('data-list-filter-placed','true');filter.classList.add('spc-list-filter');
  }
  place();
  let queued=false;
  new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;place()})}).observe(document.documentElement,{childList:true,subtree:true});
})();
